import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { Repository } from 'typeorm'
import {
  CompleteProfileDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  TelegramAuthDto,
  VerifyEmailDto,
} from './dto/auth.dto'
import { User } from '@users/entities/user.entity'
import { MailService } from '@mail/mail.service'
import { RefreshToken } from './entities/refresh-token.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.usersRepository.findOneBy({ email: dto.email })
    if (existing) throw new BadRequestException('Email уже используется')

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const code = this.generateCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
      verificationCode: code,
      verificationCodeExpiresAt: expiresAt,
    })

    await this.usersRepository.save(user)
    await this.mailService.sendVerificationCode(dto.email, code)

    return { message: 'Код подтверждения отправлен на почту' }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.usersRepository.findOneBy({ email: dto.email })
    if (!user) throw new BadRequestException('Пользователь не найден')

    //так как по дефолту стоит false, то мы явно проверяем на false, а не на !user.isVerified
    if (user.isVerified === false)
      throw new BadRequestException('Email уже подтверждён')

    if (
      user.verificationCode !== dto.code ||
      !user.verificationCodeExpiresAt ||
      user.verificationCodeExpiresAt < new Date()
    ) {
      throw new BadRequestException('Неверный или просроченный код')
    }

    user.isVerified = true
    user.verificationCode = null
    user.verificationCodeExpiresAt = null
    await this.usersRepository.save(user)

    return this.generateTokens(user)
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOneBy({ email: dto.email })
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('Неверный email или пароль')

    if (user.isVerified === false) {
      //так как у нас по дефолту стоит false, то мы явно проверяем на false, а не на !user.isVerified
      console.log('Попытка входа с неподтверждённым email:', dto.email)
      throw new UnauthorizedException('Email не подтверждён')
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isMatch) throw new UnauthorizedException('Неверный email или пароль')

    return this.generateTokens(user)
  }

  async completeProfile(userId: string, dto: CompleteProfileDto) {
    const user = await this.usersRepository.findOneBy({ id: userId })
    if (!user) throw new BadRequestException('Пользователь не найден')

    Object.assign(user, dto)
    await this.usersRepository.save(user)

    return { message: 'Профиль заполнен' }
  }

  async refresh(dto: RefreshTokenDto) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: dto.refreshToken, isRevoked: false },
      relations: ['user'],
    })

    if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh токен недействителен')
    }

    tokenEntity.isRevoked = true
    await this.refreshTokenRepository.save(tokenEntity)

    return this.generateTokens(tokenEntity.user)
  }

  async logout(dto: RefreshTokenDto): Promise<{ message: string }> {
    await this.refreshTokenRepository.update(
      { token: dto.refreshToken },
      { isRevoked: true }
    )
    return { message: 'Выход выполнен' }
  }

  async telegramAuth(dto: TelegramAuthDto) {
    if (!this.verifyTelegramHash(dto)) {
      throw new UnauthorizedException('Неверная подпись Telegram')
    }

    const telegramId = String(dto.id)
    let user = await this.usersRepository.findOneBy({ telegramId })

    if (!user) {
      user = this.usersRepository.create({
        telegramId: telegramId,
        phoneNumber: dto.phone_number ?? null,
        firstName: dto.first_name ?? null,
        lastName: dto.last_name ?? null,
        isVerified: true,
      })
      await this.usersRepository.save(user)
    }

    return this.generateTokens(user)
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    })

    const refreshTokenValue = crypto.randomBytes(64).toString('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const refreshToken = this.refreshTokenRepository.create({
      token: refreshTokenValue,
      expiresAt,
      user,
    })
    await this.refreshTokenRepository.save(refreshToken)

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      profileComplete: !!(user.firstName && user.lastName),
    }
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private verifyTelegramHash(data: TelegramAuthDto): boolean {
    const botToken = process.env.TELEGRAM_BOT_TOKEN ?? ''
    const { hash, ...rest } = data

    const checkString = Object.entries(rest)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${String(v)}`)
      .join('\n')

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex')

    return expectedHash === hash
  }
}

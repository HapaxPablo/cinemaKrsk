import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@users/entities/user.entity'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'secret',
    })
  }

  async validate(payload: { sub: string; email: string }): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: payload.sub })
    if (!user) throw new UnauthorizedException()
    return user
  }
}

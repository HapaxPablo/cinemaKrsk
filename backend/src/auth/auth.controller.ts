import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { AuthService } from './auth.service'
import {
  CompleteProfileDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  TelegramAuthDto,
  VerifyEmailDto,
} from './dto/auth.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { User } from '@users/entities/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto)
  }

  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto)
  }

  @Post('complete-profile')
  @UseGuards(JwtAuthGuard)
  completeProfile(@Req() req: Request, @Body() dto: CompleteProfileDto) {
    const user = req.user as User
    return this.authService.completeProfile(user.id, dto)
  }

  @Post('telegram')
  telegramAuth(@Body() dto: TelegramAuthDto) {
    return this.authService.telegramAuth(dto)
  }
}

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string
}

export class VerifyEmailDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  code: string
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class CompleteProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsPhoneNumber('RU')
  @IsOptional()
  phoneNumber?: string
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}

export class TelegramAuthDto {
  @IsNumber()
  id: number

  @IsString()
  @IsNotEmpty()
  hash: string

  @IsString()
  @IsOptional()
  first_name?: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsString()
  @IsOptional()
  username?: string

  @IsString()
  @IsOptional()
  phone_number?: string

  @IsNumber()
  @IsOptional()
  auth_date?: number
}

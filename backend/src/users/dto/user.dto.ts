import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'
import { Role } from '@auth/enums/role.enum'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsPhoneNumber('RU')
  phoneNumber: string
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string

  @IsPhoneNumber('RU')
  @IsOptional()
  phoneNumber?: string

  // только superuser может менять роль (проверяется в сервисе)
  @IsEnum(Role)
  @IsOptional()
  role?: Role
}

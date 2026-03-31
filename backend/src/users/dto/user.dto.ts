import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
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
}

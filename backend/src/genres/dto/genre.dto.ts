import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateGenreDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateGenreDto {
  @IsUUID()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string
}

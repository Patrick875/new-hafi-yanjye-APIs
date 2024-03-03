// filter-users.dto.ts

import { IsOptional, IsString, IsEnum } from 'class-validator'
import { Role } from '../entities/user.entity'

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsString()
  telephone?: string

  @IsOptional()
  @IsString()
  tinNumber?: string

  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @IsOptional()
  @IsString()
  email?: string
}

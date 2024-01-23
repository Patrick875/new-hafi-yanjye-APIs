import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { DiscountType } from '../entities/discount.entity'
import { Transform } from 'class-transformer'

export class CreateDiscountDto {
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  startAt: Date

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  endAt: Date

  @IsNumber()
  @MinLength(1)
  @MaxLength(100)
  rate: number

  @IsString()
  @IsEnum({ each: true })
  type: DiscountType

  @IsArray()
  @IsOptional()
  productIds: number[]

  @IsArray()
  @IsOptional()
  categoryIds: number[]
}

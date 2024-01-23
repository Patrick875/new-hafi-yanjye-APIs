import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  order: OrderType[]
}

class OrderType {
  @IsNumber()
  @IsNotEmpty()
  productId: number

  @IsNumber()
  @IsNotEmpty()
  quantity: number
}

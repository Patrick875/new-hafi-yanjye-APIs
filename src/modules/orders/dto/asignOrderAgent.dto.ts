import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'
import { User } from '../../users/entities/user.entity'

export class AsignOrderAgent {
  @IsNotEmpty()
  @IsNumber()
  agent: User

  @IsNotEmpty()
  @IsArray()
  items: OrderItems[]
}

class OrderItems {
  @IsNumber()
  @IsNotEmpty()
  productId: number
}

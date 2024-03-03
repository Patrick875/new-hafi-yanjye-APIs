import { IsNotEmpty, IsNumber, IsArray } from 'class-validator'

export class AsignOrderAgentDto {
  @IsNotEmpty()
  @IsNumber()
  agentId: number

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true }) // Ensure each item is a number
  orderItems: number[]
}

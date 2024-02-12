import { IsNotEmpty, IsNumber } from 'class-validator'

export class AsignOrderAgentDto {
  @IsNotEmpty()
  @IsNumber()
  agentId: number

  @IsNotEmpty()
  @IsNumber()
  orderItems: number[]
}

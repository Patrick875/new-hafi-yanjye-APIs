<<<<<<< HEAD
import { IsNotEmpty, IsNumber, IsArray } from 'class-validator'
=======
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator'
>>>>>>> 755f786af2b1c3f20ed2a6e5093c596bf98ccacc

export class AsignOrderAgentDto {
  @IsNotEmpty()
  @IsNumber()
  agentId: number

<<<<<<< HEAD
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true }) // Ensure each item is a number
=======
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one order item is required' })
  @IsNumber(
    {},
    { each: true, message: 'Each item in orderItems must be a number' },
  )
>>>>>>> 755f786af2b1c3f20ed2a6e5093c596bf98ccacc
  orderItems: number[]
}

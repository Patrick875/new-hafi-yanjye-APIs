import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { User } from '../../users/entities/user.entity'
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { OrderProcess } from 'src/modules/orders/entities/order-process.entity'

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  tinNumber: string

  @IsString()
  @IsEmail()
  email: string

  @ManyToOne(() => User, (user) => user.supplier)
  createdBy: User

  @OneToMany(() => OrderProcess, (supplierOrder) => supplierOrder.supplier)
  supplierOrder: OrderProcess
}

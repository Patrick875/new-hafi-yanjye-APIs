import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'
import { OrderDetails } from './order-details.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { Supplier } from 'src/modules/supplier/entities/supplier.entity'

@Entity()
export class OrderProcess {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNotEmpty()
  @IsString()
  orderId: string

  @OneToMany(() => User, (user) => user.orderProcessor)
  agent: User

  @ManyToOne(() => OrderDetails, (orderDetails) => orderDetails.orderProcessor)
  orderItem: OrderDetails

  @OneToMany(() => Supplier, (supplier) => supplier.supplierOrder)
  supplier: Supplier
}

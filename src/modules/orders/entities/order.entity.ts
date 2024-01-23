import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { OrderDetails } from './order-details.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  orderId: string

  @Column()
  orderDate: Date

  @Column()
  status: OrderStatus

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails[]

  @ManyToOne(() => User, (customer) => customer.orders)
  customer: User
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
}

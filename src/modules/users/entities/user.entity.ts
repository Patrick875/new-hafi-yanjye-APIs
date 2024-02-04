import { OrderProcess } from 'src/modules/orders/entities/order-process.entity'
import { Order } from 'src/modules/orders/entities/order.entity'
import { Supplier } from 'src/modules/supplier/entities/supplier.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  fullName: string

  @Column()
  telphone: string

  @Column({ nullable: true })
  tinNumber: string

  @Column({
    default: Role.AGENT,
  })
  role: Role

  @OneToMany(() => Order, (orders) => orders.customer)
  orders: Order[]

  @ManyToOne(() => OrderProcess, (orderProcessor) => orderProcessor.agent)
  orderProcessor: OrderProcess

  @OneToMany(() => Supplier, (supplier) => supplier.createdBy)
  supplier: Supplier

  @Column({ unique: true })
  email: string

  @Column()
  password: string
}

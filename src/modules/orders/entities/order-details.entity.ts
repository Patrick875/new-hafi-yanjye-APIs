import { Product } from 'src/modules/products/entities/product.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from './order.entity'
import { IsNotEmpty, IsNumber } from 'class-validator'

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order

  @ManyToOne(() => Product, (product) => product.orders)
  product: Product
}

import { Product } from 'src/modules/products/entities/product.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  code: string
  @Column()
  startAt: Date
  @Column()
  endAt: Date
  @Column()
  rate: number
  @Column()
  minItems: number
  @Column()
  timeUsage: number
  @Column()
  minCost: number
  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[]
}

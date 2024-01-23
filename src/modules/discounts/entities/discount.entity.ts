import { Category } from 'src/modules/categories/entities/category.entity'
import { Product } from 'src/modules/products/entities/product.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Discount {
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
  type: DiscountType
  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[]

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}

export const enum DiscountType {
  ALL_PRODUCTS = 'ALL_PRODUCTS',
  CATEGORIES = 'CATEGORIES',
  PRODUCTS = 'PRODUCTS',
}

import { Category } from 'src/modules/categories/entities/category.entity'
import { Product } from 'src/modules/products/entities/product.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum DiscountType {
  ALL_PRODUCTS = 'ALL_PRODUCTS',
  CATEGORIES = 'CATEGORIES',
  PRODUCTS = 'PRODUCTS',
}

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
  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.ALL_PRODUCTS, // Set a default value if needed
  })
  type: DiscountType

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[]

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}

import { Product } from 'src/modules/products/entities/product.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column({ nullable: true })
  description: string
  @Column({
    nullable: true,
  })
  image: string
  @OneToMany(() => Product, (products) => products.category)
  products: Product[]
}

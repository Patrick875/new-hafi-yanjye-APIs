import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductRepository } from './products.repository'
import { CategoryRepository } from '../categories/categories.repository'
import { ProductImageRepository } from './product-image.repository'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(ProductImageRepository)
    private productImageRepository: ProductImageRepository,
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    })

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found.`,
      )
    }

    // Create a new Product entity and associate it with the loaded category
    const productEntinty = this.productRepository.create({
      ...createProductDto,
      category: { ...category },
    })

    const product = await this.productRepository.save(productEntinty, {
      data: { category: true },
    })

    const productImages = createProductDto.images.map((image) =>
      this.productImageRepository.create({ ...image, product }),
    )

    // Save the product and its associated images to the database
    productEntinty.images =
      await this.productImageRepository.save(productImages)

    return product
  }

  findAll() {
    return this.productRepository.find({
      relations: { category: true, images: true },
    })
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } })
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto)
  }

  remove(id: number) {
    return this.productRepository.delete(id)
  }
}

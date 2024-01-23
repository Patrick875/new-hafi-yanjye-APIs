import { Injectable } from '@nestjs/common'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CouponRepository } from './coupons.repository'
import { ProductRepository } from '../products/products.repository'
import { In } from 'typeorm'
import { generateCode } from '../../utils/generateId'

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponRepository)
    private couponRepository: CouponRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const products = await this.productRepository.find({
      where: {
        id: In(createCouponDto.productIds),
      },
    })
    const coupon = this.couponRepository.create({
      ...createCouponDto,
      code: generateCode(6),
      timeUsage: 0,
      products: products,
    })
    return this.couponRepository.save(coupon)
  }

  findAll() {
    return this.couponRepository.find({ relations: { products: true } })
  }

  findOne(id: number) {
    return this.couponRepository.findOne({
      where: { id },
      relations: { products: true },
    })
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return this.couponRepository.update(id, updateCouponDto)
  }

  remove(id: number) {
    return this.couponRepository.delete(id)
  }
}

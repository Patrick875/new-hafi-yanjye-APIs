import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderRepository } from './orders.repository'
import { ProductRepository } from '../products/products.repository'
import { OrderDetailsRepository } from './order-details.repository'
import { OrderStatus } from './entities/order.entity'
import { OrderDetails } from './entities/order-details.entity'
import { UserRepository } from '../users/user.repository'
import { REQUEST } from '@nestjs/core'
import { CustomRequest } from '../auth/auth.constants'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(OrderDetailsRepository)
    private orderDetailsRepository: OrderDetailsRepository,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // Validate products here
    const invalidProductIds = await this.validateProducts(createOrderDto.order)

    if (invalidProductIds.length) {
      throw new NotFoundException(
        `No Product associated with ${invalidProductIds.join(', ')}`,
      )
    }

    const { user } = this.request
    const orderObj = {
      orderId: await this.generateOrderId(),
      orderDate: new Date(),
      status: OrderStatus.PENDING,
      customer: await this.userRepository.findOne({ where: { id: user.id } }),
    }

    const order = this.orderRepository.create(orderObj)

    const newOrder = await this.orderRepository.save(
      this.orderRepository.create(order),
    )

    // trtansform orderDetatils
    for (const orderItem of createOrderDto.order) {
      const orderDetails = new OrderDetails()

      const product = await this.productRepository.findOne({
        where: { id: orderItem.productId },
      })

      orderDetails.product = product
      orderDetails.quantity = orderItem.quantity
      orderDetails.order = newOrder

      const orderDetailsEntity = this.orderDetailsRepository.create({
        ...orderDetails,
        quantity: orderItem.quantity,
      })

      const newOrderDetails =
        await this.orderDetailsRepository.save(orderDetailsEntity)

      newOrder.orderDetails = newOrder.orderDetails
        ? [...newOrder.orderDetails, newOrderDetails]
        : [newOrderDetails]
    }

    await this.orderRepository.save(newOrder)

    return newOrder
  }

  asignOrderAgent() {}
  findAll() {
    return this.orderRepository.find({
      relations: { customer: true, orderDetails: true },
    })
  }

  findOne(id: number) {
    return this.orderRepository.findOne({
      where: { id: id },
      relations: { customer: true, orderDetails: { product: true } },
    })
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.update(id, updateOrderDto)
  }

  remove(id: number) {
    return `This action removes a #${id} order`
  }

  private async generateOrderId(): Promise<string> {
    const lastOrder = await this.orderRepository.find({
      order: { id: 'DESC' },
    })

    const lastOrderId = lastOrder.length ? lastOrder[0].id : 0
    const nextOrderId = lastOrderId + 2

    // You can customize the format of your order ID, for example: 'ORD-2024-00001'
    const formattedOrderId = `ORD-${new Date().getFullYear()}-${nextOrderId
      .toString()
      .padStart(5, '0')}`

    return formattedOrderId
  }

  async validateProducts(
    orderItems: { productId: number; quantity: number }[],
  ): Promise<number[]> {
    // Get the list of product IDs from the order items
    const productIds = orderItems.map((item) => item.productId)

    // Find product IDs that have no associated products
    const invalidProductIds = []

    for (const productId of productIds) {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      })
      if (!product) {
        invalidProductIds.push(productId)
      }
    }
    return invalidProductIds
  }
}

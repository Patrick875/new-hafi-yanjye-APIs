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
import { Role } from '../users/entities/user.entity'
import { Repository } from 'typeorm'
import { OrderProcess } from './entities/order-process.entity'
import { AsignOrderAgentDto } from './dto/asignOrderAgent.dto'

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
    @InjectRepository(OrderProcess)
    private orderProcessRepository: Repository<OrderProcess>,
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
      orderDetails.pricePerItem = product.price
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

      newOrder.total = newOrder.total + product.price * orderItem.quantity
    }

    await this.orderRepository.save(newOrder)

    return newOrder
  }

  async asignOrderAgent(asignOrderAgentDto: AsignOrderAgentDto) {
    const { agentId, orderItem } = asignOrderAgentDto
    const agent = await this.userRepository.findOne({
      where: { id: agentId, role: Role.AGENT },
    })

    const orderDetatil = await this.orderDetailsRepository.findOne({
      where: { id: orderItem },
    })
    if (!agent) {
      throw new NotFoundException(`Could not find agent with Id: ${agentId} `)
    }
    if (!orderDetatil) {
      throw new NotFoundException(`Could not find order with Id: ${orderItem}`)
    }
    const orderAget = this.orderProcessRepository.create({
      orderItemId: orderItem,
      agent,
    })

    return this.orderProcessRepository.save(orderAget)
  }
  findAll() {
    const { id: userId, role } = this.request.user

    if (role === Role.ADMIN) {
      return this.orderRepository.find({
        relations: { customer: true, orderDetails: true },
      })
    }
    if (role === Role.CUSTOMER) {
      return this.orderRepository.find({
        where: {
          customer: {
            id: userId,
          },
        },
        relations: {
          orderDetails: true,
        },
      })
    }

    if (role === Role.AGENT) {
      return this.orderRepository
        .createQueryBuilder('order')
        .innerJoin('order.orderDetails', 'orderDetails')
        .innerJoin('ororderDetails.orderProcess', 'OrderProcess')
        .where('orderProcess.agent = :id', { agent: userId })
    }

    return []
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

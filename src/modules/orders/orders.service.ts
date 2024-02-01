import { Inject, Injectable } from '@nestjs/common'
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

// Create a custom request interface that extends the Express.Request interface
interface CustomRequest extends Request {
  user: { /* Define the structure of the user object here */ };
}

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
    console.log(this.request.user)
    const orderObj = {
      orderId: await this.generateOrderId(),
      orderDate: new Date(),
      status: OrderStatus.PENDING,
      customer: await this.userRepository.findOne({ where: { id: 3 } }),
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

    console.log(formattedOrderId)
    return formattedOrderId
  }
}

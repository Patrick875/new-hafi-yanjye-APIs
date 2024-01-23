import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { OrderRepository } from './orders.repository'
import { OrderDetailsRepository } from './order-details.repository'
import { ProductRepository } from '../products/products.repository'
import { UserRepository } from '../users/user.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderRepository,
      OrderDetailsRepository,
      UserRepository,
      ProductRepository,
      OrderDetailsRepository,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderRepository,
    UserRepository,
    ProductRepository,
    OrderDetailsRepository,
  ],
})
export class OrdersModule {}

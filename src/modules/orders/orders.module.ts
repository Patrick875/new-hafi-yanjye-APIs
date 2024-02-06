import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { OrderRepository } from './orders.repository'
import { OrderDetailsRepository } from './order-details.repository'
import { ProductRepository } from '../products/products.repository'
import { UserRepository } from '../users/user.repository'
import { OrderProcess } from './entities/order-process.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderProcess,
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

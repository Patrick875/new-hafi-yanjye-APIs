import { Module } from '@nestjs/common'
import { UsersModule } from './modules/users/users.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { ProductsModule } from './modules/products/products.module'
import { OrdersModule } from './modules/orders/orders.module'
import { CustomersModule } from './modules/customers/customers.module'
import { CouponsModule } from './modules/coupons/coupons.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfigAsync } from './config/typeorm.config'
import { DiscountsModule } from './modules/discounts/discounts.module'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env.validation'
import { AuthModule } from './modules/auth/auth.module'
import { SiteModule } from './modules/site/site.module'
import { SupplierModule } from './modules/supplier/supplier.module'
@Module({
  imports: [
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    CouponsModule,
    DiscountsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, validate }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    SiteModule,
    SupplierModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

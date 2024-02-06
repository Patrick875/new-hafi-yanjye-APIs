import { Module } from '@nestjs/common'
import { SupplierService } from './supplier.service'
import { SupplierController } from './supplier.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Supplier } from './entities/supplier.entity'
import { SupplierRepository } from './supplier.repository'
import { UserRepository } from '../users/user.repository'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      User,
      SupplierRepository,
      UserRepository,
    ]),
  ],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    UsersService,
    SupplierRepository,
    UserRepository,
  ],
})
export class SupplierModule {}

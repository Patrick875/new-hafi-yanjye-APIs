import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from '../users/user.repository'
import { Role } from '../users/entities/user.entity'

@Injectable()
export class CustomersService {
  // create(createCustomerDto: CreateCustomerDto) {
  //   return 'This action adds a new customer'
  // }
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  findAll() {
    return this.userRepository.find({ where: { role: Role.CUSTOMER } })
  }

  findOne(id: number) {
    return this.userRepository.find({ where: { role: Role.CUSTOMER, id } })
  }

  remove(id: number) {
    return `This action removes a #${id} customer`
  }
}

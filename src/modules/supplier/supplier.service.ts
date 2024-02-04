import { Injectable } from '@nestjs/common'
import { CreateSupplierDto } from './dto/create-supplier.dto'
import { UpdateSupplierDto } from './dto/update-supplier.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { SupplierRepository } from './supplier.repository'

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierRepository)
    private supplierRepository: SupplierRepository,
  ) {}

  create(createSupplierDto: CreateSupplierDto) {
    const supplier = this.supplierRepository.create(createSupplierDto)
    console.log(createSupplierDto)
    return this.supplierRepository.save(supplier)
  }

  findAll() {
    return this.supplierRepository.find()
  }

  findOne(id: number) {
    return this.supplierRepository.findOne({ where: { id } })
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return this.supplierRepository.update(id, updateSupplierDto)
  }

  remove(id: number) {
    return this.supplierRepository.delete(id)
  }
}

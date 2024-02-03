import { Injectable } from '@nestjs/common'
import { CreateSiteDto } from './dto/create-site.dto'
import { UpdateSiteDto } from './dto/update-site.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ProvinceRepository } from './site.repository.province'
import { SiteRepository } from './site.repository'

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteRepository) private siteRepository: SiteRepository,
    // @InjectRepository(ProvinceRepository)
    // private provinceRepository: ProvinceRepository,
  ) {}

  create(createSiteDto: CreateSiteDto) {
    // const site = this.siteRepository.create({...createSiteDto})
    return createSiteDto
  }

  findAll() {
    return this.siteRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} site`
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return updateSiteDto
  }

  remove(id: number) {
    return `This action removes a #${id} site`
  }

  getAllProvince() {
    // return this.provinceRepository.find()
  }
}

import { Module } from '@nestjs/common'
import { SiteService } from './site.service'
import { SiteController } from './site.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Site } from './entities/site.entity'
import { SiteRepository } from './site.repository'
import { ProvinceRepository } from './site.repository.province'

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, SiteRepository, ProvinceRepository]),
  ],
  controllers: [SiteController],
  providers: [SiteService, SiteRepository, ProvinceRepository],
})
export class SiteModule {}

import { Module } from '@nestjs/common'
import { SiteService } from './site.service'
import { SiteController } from './site.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Site } from './entities/site.entity'
import { SiteRepository } from './site.repository'
// import { ProvinceRepository } from './site.repository.province'
// import { Province } from './entities/Province.entity'
// import { District } from './entities/district.entity'
// import { Cell } from './entities/cell.entity'
import { Village } from './entities/village.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Site,
      // Province,
      // District,
      // Cell,
      Village,
      SiteRepository,
      // ProvinceRepository,
    ]),
  ],
  controllers: [SiteController],
  providers: [SiteService, SiteRepository],
})
export class SiteModule {}

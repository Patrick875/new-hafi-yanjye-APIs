import { DataSource, Repository } from 'typeorm'
import { Site } from './entities/site.entity'

export class SiteRepository extends Repository<Site> {
  constructor(private readonly dataSource: DataSource) {
    super(Site, dataSource.createEntityManager())
  }
}

import { DataSource, Repository } from 'typeorm'
import { Province } from './entities/Province.entity'

export class ProvinceRepository extends Repository<Province> {
  constructor(private readonly dataSource: DataSource) {
    super(Province, dataSource.createEntityManager())
  }
}

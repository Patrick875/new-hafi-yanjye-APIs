import { DataSource, EntityRepository, Repository } from 'typeorm'
import { Province } from './entities/Province.entity'

@EntityRepository(Province)
export class ProvinceRepository extends Repository<Province> {
  constructor(private readonly dataSource: DataSource) {
    super(Province, dataSource.createEntityManager())
  }
}

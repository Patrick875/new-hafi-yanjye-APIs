// seeds/province.seed.ts
import { Factory, Seeder } from 'typeorm-seeding'
import provincesData from './data/address'
import { Province } from '../modules/site/entities/province.entity'
import { District } from '../modules/site/entities/district.entity'
import { Sector } from '../modules/site/entities/sector.entity'
import { Cell } from '../modules/site/entities/cell.entity'
import { Village } from '../modules/site/entities/village.entity'

export default class CreateProvinces implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (const [provinceName, districtsData] of Object.entries(provincesData)) {
      const province = await factory(Province)().create({ name: provinceName })

      for (const [districtName, sectorsData] of Object.entries(districtsData)) {
        const district = await factory(District)().create({
          name: districtName,
          province,
        })

        for (const [sectorName, cellsData] of Object.entries(sectorsData)) {
          const sector = await factory(Sector)().create({
            name: sectorName,
            district,
          })

          for (const [cellName, villagesData] of Object.entries(cellsData)) {
            const cell = await factory(Cell)().create({
              name: cellName,
              sector,
            })

            for (const villageName of villagesData) {
              await factory(Village)().create({ name: villageName, cell })
            }
          }
        }
      }
    }
  }
}

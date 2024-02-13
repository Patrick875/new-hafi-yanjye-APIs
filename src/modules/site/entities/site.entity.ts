import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { District } from './district.entity'
import { Province } from './province.entity'
import { Sector } from './sector.entity'
// import { Cell } from './cell.entity'

@Entity()
export class Site {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @ManyToOne(() => Province, (province) => province.site)
  province: Province

  @ManyToOne(() => District, (district) => district.site)
  district: District

  @ManyToOne(() => Sector, (sector) => sector.site, { nullable: false })
  sector: Sector

  // @ManyToOne(() => Cell, (cell) => cell.site)
  // cell: Cell
}

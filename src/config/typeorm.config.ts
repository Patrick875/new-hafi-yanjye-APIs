import { ConfigModule, ConfigService } from '@nestjs/config'
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm'

// not currently supported
export default class TypeORmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      // host: configService.get<string>('DB_HOST'),
      // port: configService.get<number>('DB_PORT'),
      // username: configService.get('DB_USERNAME'),
      // password: configService.get('DB_PASSWORD'),
      database: configService.get<string>('SQLITE_DB'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'sqlite',
    // host: configService.get<string>('DB_HOST'),
    // port: configService.get<number>('DB_PORT'),
    // username: configService.get<string>('DB_USERNAME'),
    // password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('SQLITE_DB'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
}

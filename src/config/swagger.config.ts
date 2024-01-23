import { DocumentBuilder } from '@nestjs/swagger'

export const config = new DocumentBuilder()
  .setTitle('Hafi Yanjye')
  .setDescription('The  REST API Documentation, describe the main endpoits')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

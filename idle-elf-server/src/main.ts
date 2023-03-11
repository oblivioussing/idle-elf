import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter, HttpExceptionFilter } from './filter/exception'
import { AppModule } from './module/app'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.setGlobalPrefix('/dieout/')
  app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))
  await app.listen(3000, '0.0.0.0')
}
bootstrap()

import { Global, Module } from '@nestjs/common'
import { RedisService } from './service'

@Global()
@Module({
  controllers: [],
  exports: [RedisService],
  imports: [],
  providers: [RedisService]
})
export class RedisModule {}

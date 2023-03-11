import { Module } from '@nestjs/common'
import { SystemService } from './service'

@Module({
  controllers: [],
  exports: [SystemService],
  imports: [],
  providers: [SystemService]
})
export class SystemModule {}

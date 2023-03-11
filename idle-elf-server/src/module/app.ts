import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../guard'
import { RedisModule } from './redis/module'
import sence from './scene'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule, ...sence],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}

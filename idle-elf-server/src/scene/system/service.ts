import { Injectable } from '@nestjs/common'

@Injectable()
export class SystemService {
  test() {
    console.log('test')
  }
}

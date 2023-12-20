import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata
} from '@nestjs/common'
import { core } from '@/utils'

// 是否需要校验权限
export const Auth = (isAuth: boolean) => SetMetadata('isAuth', isAuth)
// 获取page分页
export const QueryPage = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query
    let { pageNum, pageSize } = query
    pageNum = Number(pageNum) || 1
    pageSize = Number(pageSize) || 20
    return { pageNum, pageSize }
  }
)
// 获取query参数根据entity
export const QueryEntity = createParamDecorator(
  (entity: object, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query
    const data = core.toEntity(query, entity)
    return data
  }
)

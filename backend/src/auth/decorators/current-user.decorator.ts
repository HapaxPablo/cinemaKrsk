import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from '@users/entities/user.entity'
import type { Request } from 'express'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return request.user as User
  }
)

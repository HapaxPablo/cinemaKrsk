import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { User } from '@users/entities/user.entity'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T extends User>(err: Error, user: T): T {
    if (err || !user) throw new UnauthorizedException('Необходима авторизация')
    if (user.isBanned) throw new ForbiddenException('Аккаунт заблокирован')
    return user
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }
}

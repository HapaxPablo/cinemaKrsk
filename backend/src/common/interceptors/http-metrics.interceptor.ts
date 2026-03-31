import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { Request, Response } from 'express'
import { Histogram } from 'prom-client'
import { Observable, tap } from 'rxjs'

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly histogram: Histogram<string>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()
    const end = this.histogram.startTimer()

    return next.handle().pipe(
      tap(() => {
        end({
          method: req.method,
          route: (req.route as { path?: string } | undefined)?.path ?? req.path,
          status_code: String(res.statusCode),
        })
      })
    )
  }
}

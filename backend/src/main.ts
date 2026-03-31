import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Histogram, register } from 'prom-client'
import { AppModule } from './app.module'
import { HttpMetricsInterceptor } from '@common/interceptors/http-metrics.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const histogram = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [register],
  })

  app.useGlobalInterceptors(new HttpMetricsInterceptor(histogram))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

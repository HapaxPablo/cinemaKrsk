import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Histogram, register } from 'prom-client'
import { AppModule } from './app.module'
import { HttpMetricsInterceptor } from '@common/interceptors/http-metrics.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

  const config = new DocumentBuilder()
    .setTitle('PlayOn API')
    .setDescription('API онлайн кинотеатра PlayOn')
    .setVersion('1.0')
    .addBearerAuth() // добавляет кнопку Authorize для JWT
    .build()

  app.useGlobalInterceptors(new HttpMetricsInterceptor(histogram))
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

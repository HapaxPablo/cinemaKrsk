import { AuthModule } from '@auth/auth.module'
import { MailModule } from '@mail/mail.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '@users/users.module'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FilesModule } from './files/files.module';
import { MoviesModule } from './movies/movies.module';
import { ActorsModule } from './actors/actors.module';
import { GenresModule } from './genres/genres.module';
import { RatingModule } from './rating/rating.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    AuthModule,
    UsersModule,
    MailModule,
    FilesModule,
    MoviesModule,
    ActorsModule,
    GenresModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { GenresService } from './genres.service'
import { Genre } from './entities/genre.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GenresController } from './genres.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenresService],
  exports: [GenresService],
  controllers: [GenresController],
})
export class GenresModule {}

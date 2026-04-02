import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto'
import { Genre } from './entities/genre.entity'

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>
  ) {}

  getAllGenres(): Promise<Genre[]> {
    return this.genresRepository.find()
  }

  async getGenreById(id: string): Promise<Genre> {
    const genre = await this.genresRepository.findOneBy({ id })
    if (!genre) throw new NotFoundException(`Жанр ${id} не найден`)
    return genre
  }

  async createGenre(dto: CreateGenreDto): Promise<Genre> {
    const existing = await this.genresRepository.findOneBy({ name: dto.name })
    if (existing)
      throw new ConflictException('Жанр с таким названием уже существует')

    const genre = this.genresRepository.create(dto)
    return this.genresRepository.save(genre)
  }

  async updateGenre(id: string, dto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.getGenreById(id)

    if (dto.name && dto.name !== genre.name) {
      const existing = await this.genresRepository.findOneBy({ name: dto.name })
      if (existing)
        throw new ConflictException('Жанр с таким названием уже существует')
    }

    Object.assign(genre, dto)
    return this.genresRepository.save(genre)
  }

  async removeGenre(id: string): Promise<void> {
    const genre = await this.getGenreById(id)
    await this.genresRepository.remove(genre)
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '@auth/decorators/roles.decorator'
import { Role } from '@auth/enums/role.enum'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto'
import { GenresService } from './genres.service'

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  // доступно всем — гостям тоже
  @Get()
  getAll() {
    return this.genresService.getAllGenres()
  }

  // доступно всем — гостям тоже
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.genresService.getGenreById(id)
  }

  // только superuser
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERUSER)
  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.createGenre(dto)
  }

  // только superuser
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERUSER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.updateGenre(id, dto)
  }

  // только superuser
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERUSER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genresService.removeGenre(id)
  }
}

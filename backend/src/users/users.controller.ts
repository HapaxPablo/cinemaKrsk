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
import { CurrentUser } from '@auth/decorators/current-user.decorator'
import { Roles } from '@auth/decorators/roles.decorator'
import { Role } from '@auth/enums/role.enum'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // только superuser может создавать юзеров напрямую
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERUSER)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  // только superuser видит всех юзеров со всеми данными
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERUSER)
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  // свой профиль — только авторизованный
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto, user)
  }

  // профиль по id — только superuser
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERUSER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  // обновление — superuser может обновить любого, user только себя
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User
  ) {
    return this.usersService.update(id, updateUserDto, user)
  }

  // удаление — только superuser
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERUSER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}

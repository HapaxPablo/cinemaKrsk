import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from '@auth/enums/role.enum'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(user)
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id })
    if (!user) throw new NotFoundException(`Пользователь ${id} не найден`)
    return user
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    currentUser: User
  ): Promise<User> {
    if (currentUser.role !== Role.SUPERUSER && currentUser.id !== id) {
      throw new ForbiddenException('Нет доступа к редактированию этого профиля')
    }

    const user = await this.findOne(id)

    // user не может менять роль — только superuser
    if (currentUser.role !== Role.SUPERUSER) {
      delete dto.role
    }

    // фильтруем undefined чтобы не затирать существующие данные
    const changes = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined)
    )

    Object.assign(user, changes)
    return this.usersRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.usersRepository.remove(user)
  }
}

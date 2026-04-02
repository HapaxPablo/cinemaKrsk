import { User } from '@users/entities/user.entity'
import { Genre } from 'src/genres/entities/genre.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'date' })
  releaseDate: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rating: number

  @Column({ type: 'varchar', length: 20 })
  duration: string

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[]

  @ManyToOne(() => User, (user) => user.movies, { onDelete: 'CASCADE' })
  user: User
}

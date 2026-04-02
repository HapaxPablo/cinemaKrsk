import { Movie } from 'src/movies/enitites/movie.entity'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[]
}

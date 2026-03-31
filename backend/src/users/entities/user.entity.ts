import { RefreshToken } from '@auth/entities/refresh-token.entity'
import { Role } from '@auth/enums/role.enum'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phoneNumber: string | null

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null

  @Column({ type: 'varchar', nullable: true })
  passwordHash: string | null

  @Column({ type: 'varchar', default: false })
  isVerified: boolean

  @Column({ type: 'varchar', nullable: true })
  verificationCode: string | null

  @Column({ type: 'timestamp', nullable: true })
  verificationCodeExpiresAt: Date | null

  @Column({ type: 'varchar', nullable: true, unique: true })
  telegramId: string | null

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @Column({ default: false })
  isBanned: boolean

  @Column({ type: 'varchar', nullable: true })
  bannedReason: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[]
}

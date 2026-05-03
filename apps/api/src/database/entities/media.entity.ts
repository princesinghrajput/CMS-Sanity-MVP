import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum MediaStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed'
}

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  userId!: string

  @Column({ type: 'enum', enum: MediaStatus, default: MediaStatus.PENDING })
  status!: MediaStatus

  @Column({ type: 'varchar' })
  originalKey!: string

  @Column({ type: 'varchar', nullable: true })
  thumbnailKey?: string

  @Column({ type: 'varchar' })
  mimeType!: string

  @Column({ type: 'int' })
  fileSize!: number

  @Column({ type: 'text', nullable: true })
  errorMessage?: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}

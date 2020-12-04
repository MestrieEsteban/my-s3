import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import bcrypt from 'bcryptjs'

@Entity()
export default class Blob extends BaseEntity {
  @PrimaryGeneratedColumn()
  blobId!: number

  @Column({ nullable: false })
  blobName!: string

  @Column({ nullable: false, unique: true })
  blobPath!: string

  @Column({ nullable: false })
  blobSize!: number

  @Column({ nullable: false })
  bucketId!: string

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string

  /**
   * Hooks
   */
  @BeforeInsert()
  @BeforeUpdate()

  /**
   * Methods
   */
  public toJSON(): Blob {
    const json: Blob = Object.assign({}, this)

    return json
  }
}

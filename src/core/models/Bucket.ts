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

@Entity()
export default class Bucket extends BaseEntity {
  @PrimaryGeneratedColumn()
  bucketId!: number

  @Column({ nullable: false })
  bucketName!: string

  @Column({ nullable: false, unique: true })
  bucketPath!: string

  @Column({ nullable: false })
  uuid!: string

  @Column({ nullable: false })
  awsBucketName!: string

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
  public toJSON(): Bucket {
    const json: Bucket = Object.assign({}, this)

    return json
  }
}

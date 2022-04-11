import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { PollOptionEntity } from './poll-option.entity';
import { UserEntity } from '../../users/user.entity';
import ShortUniqueId from 'short-unique-id';

@Entity('ipoll_polls')
export class PollEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity, (user) => user.createdPolls)
  author: UserEntity;

  @RelationId('author')
  authorId: string;

  @OneToMany(() => PollOptionEntity, (option) => option.poll)
  options: PollOptionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.participatedPolls)
  participants: UserEntity[];

  @Column({ name: 'is_anonymous', default: true })
  isAnonymous: boolean;

  @Column({ name: 'has_time', default: false })
  hasTimeLimit: boolean;

  @Column({ name: 'start_time', default: new Date(), type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true, type: 'timestamp with time zone' })
  endTime?: Date;

  @BeforeInsert()
  private insertId() {
    this.id = new ShortUniqueId({ length: 8 })();
  }
}

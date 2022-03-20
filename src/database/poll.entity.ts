import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { PollOptionEntity } from './poll-option.entity';
import { UserEntity } from './user.entity';
import ShortUniqueId from 'short-unique-id';

@Entity('ipoll_polls')
export class PollEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity, (user) => user.createdPolls)
  author: UserEntity;

  @OneToMany(() => PollOptionEntity, (option) => option.poll)
  options: PollOptionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.participatedPolls)
  participants: UserEntity[];

  @Column({ name: 'is_anonymous', default: true })
  isAnonymous: boolean;

  @BeforeInsert()
  private insertId() {
    this.id = new ShortUniqueId({ length: 8 })();
  }
}

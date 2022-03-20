import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { PollOptionEntity } from './poll-option.entity';
import { PollEntity } from './poll.entity';

@Entity('ipoll_users')
export class UserEntity {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column({ default: 'anonymous' })
  name?: string;

  @ManyToMany(() => PollEntity, (poll) => poll.participants, { eager: true })
  @JoinTable()
  participatedPolls: PollEntity[];

  @OneToMany(() => PollEntity, (poll) => poll.author, { eager: true })
  createdPolls: PollEntity[];

  @ManyToMany(() => PollOptionEntity, (option) => option.votes)
  chosenOptions: PollOptionEntity[];
}

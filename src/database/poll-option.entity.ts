import ShortUniqueId from 'short-unique-id';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { PollEntity } from './poll.entity';
import { UserEntity } from './user.entity';

@Entity('ipoll_options')
export class PollOptionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => UserEntity, (user) => user.chosenOptions)
  @JoinTable()
  votes: UserEntity[];

  @RelationId('votes')
  votesId: string[]

  @ManyToOne(() => PollEntity, (poll) => poll.options)
  poll: PollEntity;

  @BeforeInsert()
  private insertId() {
    this.id = new ShortUniqueId({ length: 8 })();
  }
}

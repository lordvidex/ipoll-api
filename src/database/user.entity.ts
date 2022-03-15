import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { PollOptionEntity } from "./poll-option.entity";
import { PollEntity } from "./poll.entity";

@Entity('ipoll_users')
export class UserEntity {
  @PrimaryColumn()
  id: string

  @Column({default: 'anonymous'})
  name?: string

  @ManyToOne(() => PollEntity, poll => poll.participants)
  participatedPolls: PollEntity[]

  @ManyToOne(() => PollOptionEntity, option => option.votes)
  chosenOptions: PollOptionEntity[]
}
import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollEntity } from './entities/poll.entity';
import { PollOptionEntity } from 'src/poll/entities/poll-option.entity';
import { UserEntity } from 'src/users/user.entity';
import { VoteGateway } from './vote.gateway';

@Module({
  controllers: [PollController],
  providers: [PollService, VoteGateway],
  imports: [
    TypeOrmModule.forFeature([PollEntity, PollOptionEntity, UserEntity]),
  ],
})
export class PollModule {}

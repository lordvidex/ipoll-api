import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollEntity } from 'src/database/poll.entity';
import { PollOptionEntity } from 'src/database/poll-option.entity';
import { UserEntity } from 'src/database/user.entity';
import { VoteGateway } from './vote.gateway';

@Module({
  controllers: [PollController],
  providers: [PollService, VoteGateway],
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([PollEntity, PollOptionEntity, UserEntity]),
  ],
})
export class PollModule {}

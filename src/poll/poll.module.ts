import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollEntity } from 'src/database/poll.entity';
import { PollOptionEntity } from 'src/database/poll-option.entity';

@Module({
  controllers: [PollController],
  providers: [PollService],
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([PollEntity, PollOptionEntity]),
  ],
})
export class PollModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PollModule } from './poll/poll.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, PollModule, UsersModule],
})
export class AppModule {}

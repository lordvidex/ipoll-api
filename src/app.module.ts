import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PollModule } from './poll/poll.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    PollModule,
  ],
})
export class AppModule {}

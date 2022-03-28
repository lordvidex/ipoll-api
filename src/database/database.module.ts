import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ssl: {
          rejectUnauthorized: false,
        },
        url: configService.get('DATABASE_URL'),
        entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

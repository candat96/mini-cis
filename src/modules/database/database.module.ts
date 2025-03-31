import { DatabaseConfig } from '@config/database.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return DatabaseConfig;
      },
    }),
  ],
})
export class DatabaseModule {}

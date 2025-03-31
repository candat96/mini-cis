import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../database/entities/service.entity';
import { ServiceCategory } from '../database/entities/service-category.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceCategory]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {} 
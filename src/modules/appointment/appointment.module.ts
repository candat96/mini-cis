import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from '../database/entities/appointment.entity';
import { AppointmentDetail } from '../database/entities/appointment-detail.entity';
import { Service } from '../database/entities/service.entity';
import { Patient } from '../database/entities/patient.entity';
import { User } from '../database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@src/config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      AppointmentDetail,
      Service,
      Patient,
      User,
    ]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {} 
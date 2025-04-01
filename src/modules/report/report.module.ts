import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@src/config/config';
import { Appointment } from '../database/entities/appointment.entity';
import { AppointmentDetail } from '../database/entities/appointment-detail.entity';
import { Prescription } from '../database/entities/prescription.entity';
import { PrescriptionDetail } from '../database/entities/prescription-detail.entity';
import { User } from '../database/entities/user.entity';
import { Service } from '../database/entities/service.entity';
import { StockOut } from '../database/entities/stock-out.entity';
import { StockOutDetail } from '../database/entities/stock-out-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      AppointmentDetail,
      Prescription,
      PrescriptionDetail,
      User,
      Service,
      StockOut,
      StockOutDetail,
    ]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {} 
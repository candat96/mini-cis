import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { Prescription } from '../database/entities/prescription.entity';
import { PrescriptionDetail } from '../database/entities/prescription-detail.entity';
import { Medicine } from '../database/entities/medicine.entity';
import { Appointment } from '../database/entities/appointment.entity';
import { User } from '../database/entities/user.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { StockOut } from '../database/entities/stock-out.entity';
import { StockOutDetail } from '../database/entities/stock-out-detail.entity';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@src/config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prescription,
      PrescriptionDetail,
      Medicine,
      Appointment,
      User,
      Inventory,
      StockOut,
      StockOutDetail,
    ]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
  exports: [PrescriptionService],
})
export class PrescriptionModule {} 
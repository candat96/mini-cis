import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from '../database/entities/medicine.entity';
import { MedicineCategory } from '../database/entities/medicine-category.entity';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medicine, MedicineCategory]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [MedicineController],
  providers: [MedicineService],
  exports: [MedicineService],
})
export class MedicineModule {} 
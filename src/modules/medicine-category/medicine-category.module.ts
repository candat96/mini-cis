import { Config } from '@config/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineCategoryController } from './medicine-category.controller';
import { MedicineCategoryService } from './medicine-category.service';
import { MedicineCategory } from '../database/entities/medicine-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicineCategory]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [MedicineCategoryController],
  providers: [MedicineCategoryService],
  exports: [MedicineCategoryService],
})
export class MedicineCategoryModule {}

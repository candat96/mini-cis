import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockIn } from '../database/entities/stock-in.entity';
import { StockInDetail } from '../database/entities/stock-in-detail.entity';
import { Medicine } from '../database/entities/medicine.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { StockInController } from './stock-in.controller';
import { StockInService } from './stock-in.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@src/config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockIn,
      StockInDetail,
      Medicine,
      Inventory,
    ]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [StockInController],
  providers: [StockInService],
  exports: [StockInService],
})
export class StockInModule {} 
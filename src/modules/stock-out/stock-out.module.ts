import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from '@src/config/config';
import { StockOutController } from './stock-out.controller';
import { StockOutService } from './stock-out.service';
import { Inventory } from '../database/entities/inventory.entity';
import { Medicine } from '../database/entities/medicine.entity';
import { StockOutDetail } from '../database/entities/stock-out-detail.entity';
import { StockOut } from '../database/entities/stock-out.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOut, StockOutDetail, Medicine, Inventory]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [StockOutController],
  providers: [StockOutService],
  exports: [StockOutService],
})
export class StockOutModule {}

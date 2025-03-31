import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from '@src/config/config';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from '../database/entities/inventory.entity';
import { Medicine } from '../database/entities/medicine.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, Medicine]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

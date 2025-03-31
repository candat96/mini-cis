import { WinstonLoggerService } from '@common/services/winston.service';
import { Config } from '@config/config';
import { ApiLoggerMiddleware } from '@middlewares/logger.middleware';
import { AuthModule } from '@modules/auth/auth.module';
import { AppointmentModule } from '@modules/appointment/appointment.module';
import { DatabaseModule } from '@modules/database/database.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { MedicineModule } from '@modules/medicine/medicine.module';
import { MedicineCategoryModule } from '@modules/medicine-category/medicine-category.module';
import { PatientModule } from '@modules/patient/patient.module';
import { ServiceModule } from '@modules/service/service.module';
import { ServiceCategoryModule } from '@modules/service-category/service-category.module';
import { StockInModule } from '@modules/stock-in/stock-in.module';
import { StockOutModule } from '@modules/stock-out/stock-out.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: '120d' },
    }),
    DatabaseModule,
    AuthModule,
    PatientModule,
    ServiceCategoryModule,
    ServiceModule,
    MedicineCategoryModule,
    MedicineModule,
    StockInModule,
    StockOutModule,
    InventoryModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [WinstonLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ApiLoggerMiddleware).forRoutes('*');
  }
}

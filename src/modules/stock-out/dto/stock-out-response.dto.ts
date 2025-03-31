import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { MedicineResponseDto } from '@modules/medicine/dto';

@Exclude()
export class StockOutDetailResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  medicineId: string;

  @Expose()
  @ApiProperty({ type: () => MedicineResponseDto })
  @Type(() => MedicineResponseDto)
  medicine: MedicineResponseDto;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty()
  unitPrice: number;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiPropertyOptional()
  batchNumber?: string;
}

@Exclude()
export class StockOutResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  stockOutDate: Date;

  @Expose()
  @ApiPropertyOptional()
  recipient?: string;

  @Expose()
  @ApiPropertyOptional()
  note?: string;

  @Expose()
  @ApiProperty()
  totalAmount: number;

  @Expose()
  @ApiProperty({ type: () => [StockOutDetailResponseDto] })
  @Type(() => StockOutDetailResponseDto)
  details: StockOutDetailResponseDto[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
} 
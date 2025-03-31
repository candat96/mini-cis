import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { MedicineResponseDto } from '@modules/medicine/dto';

@Exclude()
export class StockInDetailResponseDto {
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
  expiryDate?: Date;

  @Expose()
  @ApiPropertyOptional()
  batchNumber?: string;
}

@Exclude()
export class StockInResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  stockInDate: Date;

  @Expose()
  @ApiPropertyOptional()
  supplier?: string;

  @Expose()
  @ApiPropertyOptional()
  note?: string;

  @Expose()
  @ApiProperty()
  totalAmount: number;

  @Expose()
  @ApiProperty({ type: () => [StockInDetailResponseDto] })
  @Type(() => StockInDetailResponseDto)
  details: StockInDetailResponseDto[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
} 
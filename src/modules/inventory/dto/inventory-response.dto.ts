import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { MedicineResponseDto } from '@modules/medicine/dto';

@Exclude()
export class InventoryResponseDto {
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
  @ApiPropertyOptional()
  expiryDate?: Date;

  @Expose()
  @ApiPropertyOptional()
  batchNumber?: string;

  @Expose()
  @ApiProperty()
  averageCost: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
} 
import { MedicineCategoryResponseDto } from '@modules/medicine-category/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class MedicineResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  unit: string;

  @Expose()
  @ApiProperty({ type: Number })
  sellPrice: number;

  @Expose()
  @ApiProperty({ type: Number })
  buyPrice: number;

  @Expose()
  @ApiPropertyOptional()
  manufacturer?: string;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiProperty({ type: () => MedicineCategoryResponseDto })
  @Type(() => MedicineCategoryResponseDto)
  category: MedicineCategoryResponseDto;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}

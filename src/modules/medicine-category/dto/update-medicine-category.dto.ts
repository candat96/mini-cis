import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicineCategoryDto {
  @ApiPropertyOptional({ description: 'Tên phân loại thuốc' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Mã phân loại thuốc' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Mô tả về phân loại thuốc' })
  @IsOptional()
  @IsString()
  description?: string;
}

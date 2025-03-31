import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicineCategoryDto {
  @ApiProperty({ description: 'Tên phân loại thuốc' })
  @IsNotEmpty({ message: 'Tên phân loại thuốc không được để trống' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Mã phân loại thuốc (tự động tạo nếu không nhập)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Mô tả về phân loại thuốc' })
  @IsOptional()
  @IsString()
  description?: string;
} 
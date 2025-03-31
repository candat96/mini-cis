import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicineDto {
  @ApiProperty({ description: 'Tên thuốc' })
  @IsNotEmpty({ message: 'Tên thuốc không được để trống' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Mã thuốc (tự động tạo nếu không nhập, định dạng T0001, T0002...)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Đơn vị tính (viên, gói, chai...)' })
  @IsNotEmpty({ message: 'Đơn vị tính không được để trống' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Giá bán', type: Number })
  @IsNotEmpty({ message: 'Giá bán không được để trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sellPrice: number;

  @ApiProperty({ description: 'Giá nhập', type: Number })
  @IsNotEmpty({ message: 'Giá nhập không được để trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  buyPrice: number;

  @ApiPropertyOptional({ description: 'Nhà sản xuất' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ description: 'ID phân loại thuốc' })
  @IsNotEmpty({ message: 'Phân loại thuốc không được để trống' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ description: 'Mô tả thuốc' })
  @IsOptional()
  @IsString()
  description?: string;
} 
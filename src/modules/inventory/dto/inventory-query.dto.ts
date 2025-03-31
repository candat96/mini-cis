import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class InventoryQueryDto {
  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên một trang',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tên thuốc',
  })
  @IsOptional()
  @IsString()
  medicineName?: string;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo mã thuốc',
  })
  @IsOptional()
  @IsString()
  medicineCode?: string;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo ID thuốc',
  })
  @IsOptional()
  @IsUUID()
  medicineId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ngày hết hạn sắp đến (số ngày)',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  expiryDays?: number;
}

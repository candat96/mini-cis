import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class StockInDetailDto {
  @ApiProperty({ description: 'ID thuốc' })
  @IsNotEmpty()
  @IsUUID()
  medicineId: string;

  @ApiProperty({ description: 'Số lượng nhập', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Đơn giá nhập', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Ngày hết hạn', type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @ApiPropertyOptional({ description: 'Số lô' })
  @IsOptional()
  @IsString()
  batchNumber?: string;
}

export class CreateStockInDto {
  @ApiPropertyOptional({ description: 'Mã phiếu nhập (tự động tạo nếu không nhập)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Ngày nhập kho', type: Date })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  stockInDate: Date;

  @ApiPropertyOptional({ description: 'Nhà cung cấp' })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Chi tiết phiếu nhập', type: [StockInDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockInDetailDto)
  details: StockInDetailDto[];
}

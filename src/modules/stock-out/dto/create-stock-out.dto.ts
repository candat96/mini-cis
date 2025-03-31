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

export class StockOutDetailDto {
  @ApiProperty({ description: 'ID thuốc' })
  @IsNotEmpty()
  @IsUUID()
  medicineId: string;

  @ApiProperty({ description: 'Số lượng xuất', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Đơn giá xuất', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Số lô' })
  @IsOptional()
  @IsString()
  batchNumber?: string;
}

export class CreateStockOutDto {
  @ApiPropertyOptional({ description: 'Mã phiếu xuất (tự động tạo nếu không nhập)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Ngày xuất kho', type: Date })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  stockOutDate: Date;

  @ApiPropertyOptional({ description: 'Người nhận' })
  @IsOptional()
  @IsString()
  recipient?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Chi tiết phiếu xuất', type: [StockOutDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockOutDetailDto)
  details: StockOutDetailDto[];
}

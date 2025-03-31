import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Tên dịch vụ' })
  @IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description:
      'Mã dịch vụ (tự động tạo nếu không nhập, định dạng DV0001, DV0002...)',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'ID loại dịch vụ' })
  @IsNotEmpty({ message: 'Loại dịch vụ không được để trống' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Giá tiền', type: Number })
  @IsNotEmpty({ message: 'Giá tiền không được để trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Mô tả dịch vụ' })
  @IsOptional()
  @IsString()
  description?: string;
}

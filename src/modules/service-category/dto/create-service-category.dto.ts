import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceCategoryDto {
  @ApiProperty({ description: 'Tên loại dịch vụ' })
  @IsNotEmpty({ message: 'Tên loại dịch vụ không được để trống' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Mã loại dịch vụ (tự động tạo nếu không nhập, định dạng LDV001, LDV002...)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
} 
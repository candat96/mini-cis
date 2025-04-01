import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReportQueryDto {
  @ApiPropertyOptional({
    description: 'Từ ngày (định dạng YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;

  @ApiPropertyOptional({
    description: 'Đến ngày (định dạng YYYY-MM-DD)',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDate?: Date;

  @ApiPropertyOptional({
    description: 'ID bác sĩ (dùng cho báo cáo theo bác sĩ)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;
} 
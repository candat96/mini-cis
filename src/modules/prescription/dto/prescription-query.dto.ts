import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { PrescriptionStatus } from '../../database/entities/prescription.entity';

export class PrescriptionQueryDto {
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
    description: 'ID lịch khám',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;
  
  @ApiPropertyOptional({
    description: 'ID bác sĩ',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;
  
  @ApiPropertyOptional({
    description: 'Mã đơn thuốc',
    example: 'DT000001'
  })
  @IsOptional()
  @IsString()
  code?: string;
  
  @ApiPropertyOptional({
    description: 'Trạng thái đơn thuốc',
    enum: PrescriptionStatus,
    example: PrescriptionStatus.COMPLETED
  })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;
  
  @ApiPropertyOptional({
    description: 'Từ ngày',
    example: '2023-01-01'
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;
  
  @ApiPropertyOptional({
    description: 'Đến ngày',
    example: '2023-12-31'
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDate?: Date;
} 
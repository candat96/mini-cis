import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../database/entities/appointment.entity';

export class AppointmentQueryDto {
  @ApiProperty({
    description: 'ID bệnh nhân',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiProperty({
    description: 'ID bác sĩ',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiProperty({
    description: 'Trạng thái lịch khám',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
    required: false
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Ngày bắt đầu tìm kiếm',
    example: '2023-06-01T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'Ngày kết thúc tìm kiếm',
    example: '2023-06-30T23:59:59.000Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm (tên hoặc số điện thoại bệnh nhân)',
    example: 'Nguyễn Văn A',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;
} 
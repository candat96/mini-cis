import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../database/entities/appointment.entity';

export class UpdateAppointmentServiceDto {
  @ApiProperty({
    description: 'ID chi tiết dịch vụ (nếu là cập nhật dịch vụ đã có)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'ID dịch vụ',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'Ghi chú về dịch vụ',
    example: 'Yêu cầu đặc biệt về dịch vụ',
    required: false
  })
  @IsOptional()
  @IsString()
  note?: string;
  
  @ApiProperty({
    description: 'Số lượng dịch vụ',
    example: 1,
    required: false,
    default: 1
  })
  @IsOptional()
  quantity?: number;
}

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'ID bác sĩ',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiProperty({
    description: 'Ngày giờ hẹn khám',
    example: '2023-06-15T08:30:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  appointmentDate?: Date;

  @ApiProperty({
    description: 'Trạng thái lịch khám',
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED,
    required: false
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Ghi chú',
    example: 'Lưu ý đặc biệt về lịch hẹn',
    required: false
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Danh sách dịch vụ',
    type: [UpdateAppointmentServiceDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAppointmentServiceDto)
  services?: UpdateAppointmentServiceDto[];
} 
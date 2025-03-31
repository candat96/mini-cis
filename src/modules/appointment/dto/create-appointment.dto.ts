import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentServiceDto {
  @ApiProperty({
    description: 'ID dịch vụ',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
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

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID bệnh nhân',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

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
    example: '2023-06-15T08:30:00.000Z'
  })
  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

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
    type: [CreateAppointmentServiceDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAppointmentServiceDto)
  services: CreateAppointmentServiceDto[];
} 
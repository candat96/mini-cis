import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../database/entities/appointment.entity';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'Trạng thái mới của lịch khám',
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(AppointmentStatus, { message: 'Trạng thái không hợp lệ' })
  status: AppointmentStatus;
} 
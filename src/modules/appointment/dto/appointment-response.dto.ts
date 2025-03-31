import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../database/entities/appointment.entity';
import { PatientResponseDto } from '../../patient/dto';
import { ServiceResponseDto } from '../../service/dto';

export class AppointmentServiceResponseDto {
  @ApiProperty({
    description: 'ID chi tiết dịch vụ',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Thông tin dịch vụ',
    type: ServiceResponseDto
  })
  service: ServiceResponseDto;

  @ApiProperty({
    description: 'Đơn giá',
    example: 100000,
  })
  price: number;

  @ApiProperty({
    description: 'Số lượng',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Thành tiền',
    example: 100000,
  })
  amount: number;

  @ApiProperty({
    description: 'Ghi chú',
    example: 'Lưu ý đặc biệt về dịch vụ',
    required: false,
  })
  note?: string;
}

export class AppointmentResponseDto {
  @ApiProperty({
    description: 'ID lịch khám',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Trạng thái lịch khám',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING
  })
  status: AppointmentStatus;

  @ApiProperty({
    description: 'Ngày giờ hẹn khám',
    example: '2023-06-15T08:30:00.000Z'
  })
  appointmentDate: Date;

  @ApiProperty({
    description: 'Ghi chú',
    example: 'Lưu ý đặc biệt về lịch khám',
    required: false,
  })
  note?: string;

  @ApiProperty({
    description: 'Tổng tiền',
    example: 350000,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Thông tin bệnh nhân',
    type: PatientResponseDto
  })
  patient: PatientResponseDto;

  @ApiProperty({
    description: 'ID bệnh nhân',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  patientId: string;

  @ApiProperty({
    description: 'Thông tin bác sĩ',
    type: Object,
    required: false
  })
  doctor?: any;

  @ApiProperty({
    description: 'ID bác sĩ',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  doctorId?: string;

  @ApiProperty({
    description: 'Chi tiết dịch vụ',
    type: [AppointmentServiceResponseDto]
  })
  details: AppointmentServiceResponseDto[];

  @ApiProperty({
    description: 'Ngày tạo',
    example: '2023-06-15T08:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Ngày cập nhật',
    example: '2023-06-15T08:30:00.000Z'
  })
  updatedAt: Date;
}

export class PaginatedAppointmentsResponseDto {
  @ApiProperty({
    description: 'Danh sách lịch khám',
    type: [AppointmentResponseDto]
  })
  data: AppointmentResponseDto[];

  @ApiProperty({
    description: 'Tổng số lịch khám',
    example: 25
  })
  total: number;

  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng lịch khám trên mỗi trang',
    example: 10
  })
  limit: number;
} 
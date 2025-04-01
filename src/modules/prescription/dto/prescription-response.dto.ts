import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionStatus } from '../../database/entities/prescription.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PrescriptionMedicineDto {
  @Expose()
  @ApiProperty({
    description: 'ID chi tiết đơn thuốc'
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'ID thuốc'
  })
  medicineId: string;

  @Expose()
  @ApiProperty({
    description: 'Thông tin thuốc'
  })
  medicine: {
    id: string;
    name: string;
    code: string;
    unit: string;
  };

  @Expose()
  @ApiProperty({
    description: 'Đơn giá'
  })
  price: number;

  @Expose()
  @ApiProperty({
    description: 'Số lượng'
  })
  quantity: number;

  @Expose()
  @ApiProperty({
    description: 'Thành tiền'
  })
  amount: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Liều lượng (VD: 1 viên/lần)'
  })
  dosage?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Tần suất (VD: 3 lần/ngày)'
  })
  frequency?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Thời gian dùng (VD: 5 ngày)'
  })
  duration?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Hướng dẫn sử dụng (VD: Uống sau ăn)'
  })
  instruction?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Ghi chú thêm'
  })
  note?: string;
}

@Exclude()
export class PrescriptionResponseDto {
  @Expose()
  @ApiProperty({
    description: 'ID đơn thuốc'
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Mã đơn thuốc',
    example: 'DT000001'
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: 'Trạng thái đơn thuốc',
    enum: PrescriptionStatus,
    example: PrescriptionStatus.DRAFT
  })
  status: PrescriptionStatus;

  @Expose()
  @ApiProperty({
    description: 'Tổng tiền'
  })
  totalAmount: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Ghi chú đơn thuốc'
  })
  note?: string;

  @Expose()
  @ApiProperty({
    description: 'ID lịch khám'
  })
  appointmentId: string;

  @Expose()
  @ApiProperty({
    description: 'Thông tin lịch khám'
  })
  appointment: {
    id: string;
    code?: string;
    appointmentDate: Date;
    patient: {
      id: string;
      name: string;
      code: string;
      phone: string;
    };
  };

  @Expose()
  @ApiProperty({
    description: 'ID bác sĩ'
  })
  doctorId: string;

  @Expose()
  @ApiProperty({
    description: 'Thông tin bác sĩ'
  })
  doctor: {
    id: string;
    username: string;
    fullname?: string;
  };

  @Expose()
  @ApiProperty({
    description: 'Danh sách thuốc',
    type: [PrescriptionMedicineDto]
  })
  @Type(() => PrescriptionMedicineDto)
  details: PrescriptionMedicineDto[];

  @Expose()
  @ApiProperty({
    description: 'Thông tin phiếu xuất kho'
  })
  stockOut?: {
    id: string;
    code: string;
    stockOutDate: Date;
  };

  @Expose()
  @ApiProperty({
    description: 'Ngày tạo'
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Ngày cập nhật'
  })
  updatedAt: Date;
} 
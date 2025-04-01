import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MedicineSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'ID thuốc',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  medicineId: string;

  @Expose()
  @ApiProperty({
    description: 'Mã thuốc',
    example: 'MED001'
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: 'Tên thuốc',
    example: 'Paracetamol'
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Đơn vị tính',
    example: 'Viên'
  })
  unit: string;

  @Expose()
  @ApiProperty({
    description: 'Đơn giá',
    example: 5000
  })
  price: number;

  @Expose()
  @ApiProperty({
    description: 'Số lượng đã bán',
    example: 100
  })
  quantity: number;

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu từ thuốc này',
    example: 500000
  })
  revenue: number;
}

@Exclude()
export class DoctorMedicineRevenueResponseDto {
  @Expose()
  @ApiProperty({
    description: 'ID bác sĩ',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  doctorId: string;

  @Expose()
  @ApiProperty({
    description: 'Tên đăng nhập bác sĩ',
    example: 'doctor1'
  })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'Họ tên bác sĩ',
    example: 'Nguyễn Văn A'
  })
  fullname: string;

  @Expose()
  @ApiProperty({
    description: 'Danh sách doanh thu theo thuốc',
    type: [MedicineSummaryDto]
  })
  medicines: MedicineSummaryDto[];

  @Expose()
  @ApiProperty({
    description: 'Tổng số lượng thuốc',
    example: 350
  })
  totalQuantity: number;

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu thuốc',
    example: 3000000
  })
  totalRevenue: number;

  @Expose()
  @ApiProperty({
    description: 'Số đơn thuốc đã kê',
    example: 45
  })
  prescriptionCount: number;

  @Expose()
  @ApiProperty({
    description: 'Từ ngày',
    example: '2023-01-01'
  })
  fromDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Đến ngày',
    example: '2023-12-31'
  })
  toDate: Date;
} 
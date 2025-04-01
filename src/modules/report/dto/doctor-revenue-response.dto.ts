import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DoctorSummaryDto {
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
    description: 'Doanh thu từ dịch vụ',
    example: 5000000
  })
  serviceRevenue: number;

  @Expose()
  @ApiProperty({
    description: 'Doanh thu từ thuốc',
    example: 3000000
  })
  medicineRevenue: number;

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu',
    example: 8000000
  })
  totalRevenue: number;

  @Expose()
  @ApiProperty({
    description: 'Số lượng lịch khám đã hoàn thành',
    example: 50
  })
  appointmentCount: number;

  @Expose()
  @ApiProperty({
    description: 'Số đơn thuốc đã hoàn thành',
    example: 45
  })
  prescriptionCount: number;
}

@Exclude()
export class DoctorRevenueResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Danh sách doanh thu theo bác sĩ',
    type: [DoctorSummaryDto]
  })
  doctors: DoctorSummaryDto[];

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu dịch vụ của tất cả bác sĩ',
    example: 15000000
  })
  totalServiceRevenue: number;

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu thuốc của tất cả bác sĩ',
    example: 9000000
  })
  totalMedicineRevenue: number;

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu của tất cả bác sĩ',
    example: 24000000
  })
  totalRevenue: number;

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
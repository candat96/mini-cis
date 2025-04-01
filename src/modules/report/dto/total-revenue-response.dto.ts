import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TotalRevenueResponseDto {
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
    example: 120
  })
  appointmentCount: number;

  @Expose()
  @ApiProperty({
    description: 'Số đơn thuốc đã hoàn thành',
    example: 100
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
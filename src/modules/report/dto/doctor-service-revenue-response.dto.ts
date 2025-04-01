import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ServiceSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'ID dịch vụ',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  serviceId: string;

  @Expose()
  @ApiProperty({
    description: 'Tên dịch vụ',
    example: 'Khám tổng quát'
  })
  serviceName: string;

  @Expose()
  @ApiProperty({
    description: 'Giá dịch vụ',
    example: 200000
  })
  price: number;

  @Expose()
  @ApiProperty({
    description: 'Số lượng',
    example: 25
  })
  quantity: number;

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu từ dịch vụ này',
    example: 5000000
  })
  revenue: number;
}

@Exclude()
export class DoctorServiceRevenueResponseDto {
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
    description: 'Danh sách doanh thu theo dịch vụ',
    type: [ServiceSummaryDto]
  })
  services: ServiceSummaryDto[];

  @Expose()
  @ApiProperty({
    description: 'Tổng số lượng dịch vụ',
    example: 120
  })
  totalQuantity: number;

  @Expose()
  @ApiProperty({
    description: 'Tổng doanh thu dịch vụ',
    example: 15000000
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
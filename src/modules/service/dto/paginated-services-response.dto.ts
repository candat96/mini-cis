import { ApiProperty } from '@nestjs/swagger';
import { ServiceResponseDto } from './service-response.dto';

export class PaginatedServicesResponseDto {
  @ApiProperty({
    description: 'Danh sách dịch vụ',
    type: [ServiceResponseDto],
  })
  items: ServiceResponseDto[];

  @ApiProperty({
    description: 'Tổng số dịch vụ',
  })
  total: number;

  @ApiProperty({
    description: 'Trang hiện tại',
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng bản ghi trên một trang',
  })
  limit: number;

  @ApiProperty({
    description: 'Tổng số trang',
  })
  pageCount: number;
} 
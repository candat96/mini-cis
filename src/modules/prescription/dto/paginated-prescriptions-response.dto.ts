import { ApiProperty } from '@nestjs/swagger';
import { PrescriptionResponseDto } from './prescription-response.dto';

export class PaginatedPrescriptionsResponseDto {
  @ApiProperty({
    description: 'Danh sách đơn thuốc',
    type: [PrescriptionResponseDto],
  })
  items: PrescriptionResponseDto[];

  @ApiProperty({
    description: 'Tổng số đơn thuốc',
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
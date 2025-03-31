import { ApiProperty } from '@nestjs/swagger';
import { StockInResponseDto } from './stock-in-response.dto';

export class PaginatedStockInsResponseDto {
  @ApiProperty({
    description: 'Danh sách phiếu nhập kho',
    type: [StockInResponseDto],
  })
  items: StockInResponseDto[];

  @ApiProperty({
    description: 'Tổng số phiếu nhập kho',
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
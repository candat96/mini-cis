import { ApiProperty } from '@nestjs/swagger';
import { StockOutResponseDto } from './stock-out-response.dto';

export class PaginatedStockOutsResponseDto {
  @ApiProperty({
    description: 'Danh sách phiếu xuất kho',
    type: [StockOutResponseDto],
  })
  items: StockOutResponseDto[];

  @ApiProperty({
    description: 'Tổng số phiếu xuất kho',
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

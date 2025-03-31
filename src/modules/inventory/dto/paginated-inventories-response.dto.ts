import { ApiProperty } from '@nestjs/swagger';
import { InventoryResponseDto } from './inventory-response.dto';

export class PaginatedInventoriesResponseDto {
  @ApiProperty({
    description: 'Danh sách tồn kho',
    type: [InventoryResponseDto],
  })
  items: InventoryResponseDto[];

  @ApiProperty({
    description: 'Tổng số bản ghi tồn kho',
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
import { ApiProperty } from '@nestjs/swagger';
import { MedicineCategoryResponseDto } from './medicine-category-response.dto';

export class PaginatedMedicineCategoriesResponseDto {
  @ApiProperty({
    description: 'Danh sách phân loại thuốc',
    type: [MedicineCategoryResponseDto],
  })
  items: MedicineCategoryResponseDto[];

  @ApiProperty({
    description: 'Tổng số phân loại thuốc',
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
import { ApiProperty } from '@nestjs/swagger';
import { ServiceCategoryResponseDto } from './service-category-response.dto';

export class PaginatedServiceCategoriesResponseDto {
  @ApiProperty({
    description: 'Danh sách loại dịch vụ',
    type: [ServiceCategoryResponseDto],
  })
  items: ServiceCategoryResponseDto[];

  @ApiProperty({
    description: 'Tổng số loại dịch vụ',
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

import { ApiProperty } from '@nestjs/swagger';
import { MedicineResponseDto } from './medicine-response.dto';

export class PaginatedMedicinesResponseDto {
  @ApiProperty({
    description: 'Danh sách thuốc',
    type: [MedicineResponseDto],
  })
  items: MedicineResponseDto[];

  @ApiProperty({
    description: 'Tổng số thuốc',
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
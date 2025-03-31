import { ApiProperty } from '@nestjs/swagger';
import { PatientResponseDto } from './patient-response.dto';

export class PaginatedPatientsResponseDto {
  @ApiProperty({
    description: 'Danh sách bệnh nhân',
    type: [PatientResponseDto],
  })
  items: PatientResponseDto[];

  @ApiProperty({
    description: 'Tổng số bệnh nhân',
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
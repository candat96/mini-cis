import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DoctorQueryDto {
  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tên đăng nhập hoặc họ tên đầy đủ',
    example: 'Nguyễn'
  })
  @IsOptional()
  @IsString()
  search?: string;
} 
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionStatus } from '../../database/entities/prescription.entity';

export class UpdatePrescriptionMedicineDto {
  @ApiPropertyOptional({
    description: 'ID chi tiết đơn thuốc (dùng khi cập nhật)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'ID thuốc',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  medicineId: string;

  @ApiProperty({
    description: 'Số lượng',
    example: 10
  })
  quantity: number;

  @ApiPropertyOptional({
    description: 'Liều lượng (VD: 1 viên/lần)',
    example: '1 viên/lần'
  })
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiPropertyOptional({
    description: 'Tần suất (VD: 3 lần/ngày)',
    example: '3 lần/ngày'
  })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional({
    description: 'Thời gian dùng (VD: 5 ngày)',
    example: '5 ngày'
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: 'Hướng dẫn sử dụng (VD: Uống sau ăn)',
    example: 'Uống sau ăn'
  })
  @IsOptional()
  @IsString()
  instruction?: string;

  @ApiPropertyOptional({
    description: 'Ghi chú thêm',
    example: 'Chú ý tác dụng phụ'
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdatePrescriptionDto {
  @ApiPropertyOptional({
    description: 'ID của bác sĩ kê đơn',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái đơn thuốc',
    enum: PrescriptionStatus,
    example: PrescriptionStatus.COMPLETED
  })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @ApiPropertyOptional({
    description: 'Ghi chú cho đơn thuốc',
    example: 'Tái khám sau 2 tuần'
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'Danh sách thuốc trong đơn',
    type: [UpdatePrescriptionMedicineDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePrescriptionMedicineDto)
  medicines?: UpdatePrescriptionMedicineDto[];
} 
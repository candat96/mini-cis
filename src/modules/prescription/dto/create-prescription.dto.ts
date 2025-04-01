import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrescriptionMedicineDto {
  @ApiProperty({
    description: 'ID thuốc',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  medicineId: string;

  @ApiProperty({
    description: 'Số lượng',
    example: 10
  })
  @IsNotEmpty()
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

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'ID của lịch khám',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty({
    description: 'ID của bác sĩ kê đơn',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiPropertyOptional({
    description: 'Ghi chú cho đơn thuốc',
    example: 'Tái khám sau 2 tuần'
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Danh sách thuốc trong đơn',
    type: [CreatePrescriptionMedicineDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionMedicineDto)
  medicines: CreatePrescriptionMedicineDto[];
} 
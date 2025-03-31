import { Gender } from '@modules/database/enums/gender.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto {
  @ApiPropertyOptional({ description: 'Tên bệnh nhân' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Giới tính',
    enum: Gender,
    enumName: 'Gender',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Địa chỉ' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Nghề nghiệp' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ 
    description: 'Ngày sinh',
    example: '1990-01-01',
    type: Date
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;
}

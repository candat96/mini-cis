import { Gender } from '@modules/database/enums/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ description: 'Tên bệnh nhân' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  phone: string;

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

import { Gender } from '@modules/database/enums/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PatientResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Mã bệnh nhân',
    example: 'BN000001'
  })
  code: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiPropertyOptional({ enum: Gender, enumName: 'Gender' })
  gender?: Gender;

  @Expose()
  @ApiPropertyOptional()
  address?: string;

  @Expose()
  @ApiPropertyOptional()
  occupation?: string;

  @Expose()
  @ApiPropertyOptional({ 
    description: 'Ngày sinh', 
    example: '1990-01-01',
    type: Date
  })
  birthDate?: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}

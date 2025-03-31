import { UserRole } from '@modules/database/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DoctorResponseDto {
  @Expose()
  @ApiProperty({
    description: 'ID bác sĩ',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'doctor1'
  })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'Email',
    example: 'doctor1@example.com'
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Số điện thoại',
    example: '0987654321'
  })
  phone: string;

  @Expose()
  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Bác sĩ Nguyễn Văn A',
    required: false
  })
  fullname?: string;

  @Expose()
  @ApiProperty({
    description: 'Vai trò',
    enum: UserRole,
    example: UserRole.DOCTOR
  })
  role: UserRole;

  @Expose()
  @ApiProperty({
    description: 'Ngày tạo',
    example: '2023-06-15T08:30:00.000Z'
  })
  createdAt: Date;
} 
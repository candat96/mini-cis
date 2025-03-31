import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@modules/database/enums/user-role.enum';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User ID',
    example: '5f9d5c5b8b3c1c2d3c4d5e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'john.doe',
  })
  username: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.RECEPTIONIST,
  })
  role: UserRole;
}

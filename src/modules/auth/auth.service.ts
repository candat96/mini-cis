import { Config } from '@config/config';
import { User } from '@modules/database/entities/user.entity';
import { UserRole } from '@modules/database/enums/user-role.enum';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { IAccessTokenAuth } from '@common/guards/auth.guard';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    // Find user by username
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.username,
        avatar: '', // Add avatar field to user entity if needed
        role: user.role,
      } as IAccessTokenAuth,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: Config.JWT_SECRET,
      expiresIn:'120d',
    });

    return {
      accessToken,
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }

  /**
   * Create a new user
   * @param createUserDto User creation data
   * @returns Created user information
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { username, password, email, phone, role } = createUserDto;

    // Check if username already exists
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if phone already exists
    const existingPhone = await this.userRepository.findOne({
      where: { phone },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = this.userRepository.create({
        username,
        password: hashedPassword,
        email,
        phone,
        role: role || UserRole.RECEPTIONIST, // Default role if not provided
      });

      // Save user to database
      const savedUser = await this.userRepository.save(user);

      return {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  /**
   * Get user by ID
   * @param id User ID
   * @returns User information
   */
  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Helper method to compare passwords
   * In a real app, you would implement proper password hashing and comparison
   */
  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // For demonstration purposes, we're doing a direct comparison
    // In production, use bcrypt.compare
    try {
      // If the password is already hashed, use bcrypt.compare
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      // If bcrypt.compare fails (e.g., password is not hashed), fall back to direct comparison
      // This is just for demonstration and should not be used in production
      return plainPassword === hashedPassword;
    }
  }
}

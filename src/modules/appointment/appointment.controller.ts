import { AuthGuardDecorator } from '@common/decorators/auth-guard.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentQueryDto,
  AppointmentResponseDto,
  PaginatedAppointmentsResponseDto,
  UpdateAppointmentStatusDto
} from './dto';
import { UserRole } from '../database/enums/user-role.enum';

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth()
@AuthGuardDecorator(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới lịch khám' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo lịch khám thành công',
    type: AppointmentResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bệnh nhân hoặc bác sĩ hoặc dịch vụ',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lịch khám với tìm kiếm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách lịch khám thành công',
    type: [AppointmentResponseDto]
  })
  findAll(@Query() query: AppointmentQueryDto): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin lịch khám theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin lịch khám thành công',
    type: AppointmentResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy lịch khám',
  })
  findOne(@Param('id') id: string): Promise<AppointmentResponseDto> {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin lịch khám' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật lịch khám thành công',
    type: AppointmentResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy lịch khám hoặc bác sĩ hoặc dịch vụ',
  })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái lịch khám' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật trạng thái lịch khám thành công',
    type: AppointmentResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy lịch khám',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa lịch khám' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Xóa lịch khám thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy lịch khám',
  })
  @AuthGuardDecorator(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.appointmentService.remove(id);
  }
} 
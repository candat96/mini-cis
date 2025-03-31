import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { 
  CreatePatientDto, 
  PaginatedPatientsResponseDto, 
  PatientQueryDto, 
  PatientResponseDto, 
  UpdatePatientDto 
} from './dto';
import { AuthGuardDecorator } from '@common/decorators/auth-guard.decorator';

@ApiTags('Patients')
@Controller('patients')
@AuthGuardDecorator()
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới bệnh nhân' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo bệnh nhân thành công',
    type: PatientResponseDto,
  })
  async createPatient(@Body() createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bệnh nhân có phân trang và tìm kiếm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách bệnh nhân thành công',
    type: PaginatedPatientsResponseDto,
  })
  async getAllPatients(@Query() query: PatientQueryDto): Promise<PaginatedPatientsResponseDto> {
    return this.patientService.getAllPatients(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin bệnh nhân theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin bệnh nhân thành công',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bệnh nhân',
  })
  async getPatientById(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.patientService.getPatientById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bệnh nhân' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật bệnh nhân thành công',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bệnh nhân',
  })
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa bệnh nhân' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Xóa bệnh nhân thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bệnh nhân',
  })
  async deletePatient(@Param('id') id: string): Promise<void> {
    return this.patientService.deletePatient(id);
  }
} 
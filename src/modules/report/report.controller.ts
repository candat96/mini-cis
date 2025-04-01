import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuardDecorator } from '@common/decorators/auth-guard.decorator';
import { ReportService } from './report.service';
import {
  ReportQueryDto,
  TotalRevenueResponseDto,
  DoctorRevenueResponseDto,
  DoctorServiceRevenueResponseDto,
  DoctorMedicineRevenueResponseDto,
} from './dto';

@ApiTags('Reports')
@Controller('reports')
@AuthGuardDecorator()
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('total-revenue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Báo cáo doanh thu tổng hợp (dịch vụ và thuốc)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Báo cáo doanh thu tổng hợp thành công',
    type: TotalRevenueResponseDto,
  })
  getTotalRevenue(@Query() query: ReportQueryDto): Promise<TotalRevenueResponseDto> {
    return this.reportService.getTotalRevenue(query);
  }

  @Get('doctor-revenue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Báo cáo doanh thu tổng hợp theo bác sĩ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Báo cáo doanh thu tổng hợp theo bác sĩ thành công',
    type: DoctorRevenueResponseDto,
  })
  getDoctorRevenue(@Query() query: ReportQueryDto): Promise<DoctorRevenueResponseDto> {
    return this.reportService.getDoctorRevenue(query);
  }

  @Get('doctor/:doctorId/service-revenue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Báo cáo doanh thu dịch vụ theo bác sĩ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Báo cáo doanh thu dịch vụ theo bác sĩ thành công',
    type: DoctorServiceRevenueResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bác sĩ',
  })
  getDoctorServiceRevenue(
    @Param('doctorId') doctorId: string,
    @Query() query: ReportQueryDto,
  ): Promise<DoctorServiceRevenueResponseDto> {
    return this.reportService.getDoctorServiceRevenue(doctorId, query);
  }

  @Get('doctor/:doctorId/medicine-revenue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Báo cáo doanh thu thuốc theo bác sĩ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Báo cáo doanh thu thuốc theo bác sĩ thành công',
    type: DoctorMedicineRevenueResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bác sĩ',
  })
  getDoctorMedicineRevenue(
    @Param('doctorId') doctorId: string,
    @Query() query: ReportQueryDto,
  ): Promise<DoctorMedicineRevenueResponseDto> {
    return this.reportService.getDoctorMedicineRevenue(doctorId, query);
  }
} 
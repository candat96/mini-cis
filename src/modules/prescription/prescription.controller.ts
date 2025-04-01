import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuardDecorator } from '@common/decorators/auth-guard.decorator';
import { PrescriptionService } from './prescription.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  PrescriptionResponseDto,
  PrescriptionQueryDto,
  PaginatedPrescriptionsResponseDto,
} from './dto';

@ApiTags('Prescriptions')
@Controller('prescriptions')
@AuthGuardDecorator()
@ApiBearerAuth()
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo mới đơn thuốc' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đơn thuốc đã được tạo thành công',
    type: PrescriptionResponseDto,
  })
  create(@Body() createPrescriptionDto: CreatePrescriptionDto): Promise<PrescriptionResponseDto> {
    return this.prescriptionService.createPrescription(createPrescriptionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách đơn thuốc theo điều kiện' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách đơn thuốc đã phân trang',
    type: PaginatedPrescriptionsResponseDto,
  })
  findAll(@Query() query: PrescriptionQueryDto): Promise<PaginatedPrescriptionsResponseDto> {
    return this.prescriptionService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy chi tiết đơn thuốc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chi tiết đơn thuốc',
    type: PrescriptionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy đơn thuốc',
  })
  findOne(@Param('id') id: string): Promise<PrescriptionResponseDto> {
    return this.prescriptionService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật đơn thuốc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đơn thuốc đã được cập nhật',
    type: PrescriptionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy đơn thuốc',
  })
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    return this.prescriptionService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa đơn thuốc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đơn thuốc đã được xóa',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy đơn thuốc',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.prescriptionService.remove(id);
  }
} 
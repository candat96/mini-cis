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
import { AuthGuardDecorator } from '@common/decorators/auth-guard.decorator';
import { MedicineService } from './medicine.service';
import {
  CreateMedicineDto,
  MedicineQueryDto,
  MedicineResponseDto,
  PaginatedMedicinesResponseDto,
  UpdateMedicineDto,
} from './dto';

@ApiTags('Medicines')
@Controller('medicines')
@ApiBearerAuth()
@AuthGuardDecorator()
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới thuốc' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo thuốc thành công',
    type: MedicineResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã thuốc đã tồn tại',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phân loại thuốc',
  })
  async createMedicine(@Body() createMedicineDto: CreateMedicineDto): Promise<MedicineResponseDto> {
    return this.medicineService.createMedicine(createMedicineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thuốc có phân trang và tìm kiếm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách thuốc thành công',
    type: PaginatedMedicinesResponseDto,
  })
  async getAllMedicines(@Query() query: MedicineQueryDto): Promise<PaginatedMedicinesResponseDto> {
    return this.medicineService.getAllMedicines(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thuốc theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin thuốc thành công',
    type: MedicineResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy thuốc',
  })
  async getMedicineById(@Param('id') id: string): Promise<MedicineResponseDto> {
    return this.medicineService.getMedicineById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin thuốc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thuốc thành công',
    type: MedicineResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy thuốc hoặc phân loại thuốc',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã thuốc đã tồn tại',
  })
  async updateMedicine(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ): Promise<MedicineResponseDto> {
    return this.medicineService.updateMedicine(id, updateMedicineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa thuốc' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Xóa thuốc thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy thuốc',
  })
  async deleteMedicine(@Param('id') id: string): Promise<void> {
    return this.medicineService.deleteMedicine(id);
  }
} 
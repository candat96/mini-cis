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
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateServiceDto,
  PaginatedServicesResponseDto,
  ServiceQueryDto,
  ServiceResponseDto,
  UpdateServiceDto,
} from './dto';
import { ServiceService } from './service.service';

@ApiTags('Services')
@Controller('services')
@AuthGuardDecorator()
@ApiBearerAuth()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới dịch vụ' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo dịch vụ thành công',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã dịch vụ đã tồn tại',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy loại dịch vụ',
  })
  async createService(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.serviceService.createService(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách dịch vụ có phân trang và tìm kiếm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách dịch vụ thành công',
    type: PaginatedServicesResponseDto,
  })
  async getAllServices(
    @Query() query: ServiceQueryDto,
  ): Promise<PaginatedServicesResponseDto> {
    return this.serviceService.getAllServices(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin dịch vụ theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin dịch vụ thành công',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy dịch vụ',
  })
  async getServiceById(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.serviceService.getServiceById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin dịch vụ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật dịch vụ thành công',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy dịch vụ hoặc loại dịch vụ',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã dịch vụ đã tồn tại',
  })
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.serviceService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa dịch vụ' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Xóa dịch vụ thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy dịch vụ',
  })
  async deleteService(@Param('id') id: string): Promise<void> {
    return this.serviceService.deleteService(id);
  }
}

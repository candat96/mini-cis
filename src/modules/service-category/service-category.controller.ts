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
import { ServiceCategoryService } from './service-category.service';
import {
  CreateServiceCategoryDto,
  PaginatedServiceCategoriesResponseDto,
  ServiceCategoryQueryDto,
  ServiceCategoryResponseDto,
  UpdateServiceCategoryDto,
} from './dto';

@ApiTags('Service Categories')
@Controller('service-categories')
@ApiBearerAuth()
@AuthGuardDecorator()
export class ServiceCategoryController {
  constructor(private readonly serviceCategoryService: ServiceCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới loại dịch vụ' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo loại dịch vụ thành công',
    type: ServiceCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã loại dịch vụ đã tồn tại',
  })
  async createServiceCategory(
    @Body() createServiceCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    return this.serviceCategoryService.createServiceCategory(createServiceCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách loại dịch vụ có phân trang và tìm kiếm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách loại dịch vụ thành công',
    type: PaginatedServiceCategoriesResponseDto,
  })
  async getAllServiceCategories(
    @Query() query: ServiceCategoryQueryDto,
  ): Promise<PaginatedServiceCategoriesResponseDto> {
    return this.serviceCategoryService.getAllServiceCategories(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin loại dịch vụ theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin loại dịch vụ thành công',
    type: ServiceCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy loại dịch vụ',
  })
  async getServiceCategoryById(@Param('id') id: string): Promise<ServiceCategoryResponseDto> {
    return this.serviceCategoryService.getServiceCategoryById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin loại dịch vụ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật loại dịch vụ thành công',
    type: ServiceCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy loại dịch vụ',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã loại dịch vụ đã tồn tại',
  })
  async updateServiceCategory(
    @Param('id') id: string,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    return this.serviceCategoryService.updateServiceCategory(id, updateServiceCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa loại dịch vụ' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Xóa loại dịch vụ thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy loại dịch vụ',
  })
  async deleteServiceCategory(@Param('id') id: string): Promise<void> {
    return this.serviceCategoryService.deleteServiceCategory(id);
  }
} 
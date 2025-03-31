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
  CreateMedicineCategoryDto,
  MedicineCategoryQueryDto,
  MedicineCategoryResponseDto,
  PaginatedMedicineCategoriesResponseDto,
  UpdateMedicineCategoryDto,
} from './dto';
import { MedicineCategoryService } from './medicine-category.service';

@ApiTags('Medicine Categories')
@Controller('medicine-categories')
@ApiBearerAuth()
@AuthGuardDecorator()
export class MedicineCategoryController {
  constructor(private readonly medicineCategoryService: MedicineCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới phân loại thuốc' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo phân loại thuốc thành công',
    type: MedicineCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã phân loại thuốc đã tồn tại',
  })
  async createMedicineCategory(
    @Body() createMedicineCategoryDto: CreateMedicineCategoryDto,
  ): Promise<MedicineCategoryResponseDto> {
    return this.medicineCategoryService.createMedicineCategory(
      createMedicineCategoryDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách phân loại thuốc có phân trang và tìm kiếm',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách phân loại thuốc thành công',
    type: PaginatedMedicineCategoriesResponseDto,
  })
  async getAllMedicineCategories(
    @Query() query: MedicineCategoryQueryDto,
  ): Promise<PaginatedMedicineCategoriesResponseDto> {
    return this.medicineCategoryService.getAllMedicineCategories(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin phân loại thuốc theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin phân loại thuốc thành công',
    type: MedicineCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phân loại thuốc',
  })
  async getMedicineCategoryById(
    @Param('id') id: string,
  ): Promise<MedicineCategoryResponseDto> {
    return this.medicineCategoryService.getMedicineCategoryById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin phân loại thuốc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật phân loại thuốc thành công',
    type: MedicineCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phân loại thuốc',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Mã phân loại thuốc đã tồn tại',
  })
  async updateMedicineCategory(
    @Param('id') id: string,
    @Body() updateMedicineCategoryDto: UpdateMedicineCategoryDto,
  ): Promise<MedicineCategoryResponseDto> {
    return this.medicineCategoryService.updateMedicineCategory(
      id,
      updateMedicineCategoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa phân loại thuốc' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Xóa phân loại thuốc thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phân loại thuốc',
  })
  async deleteMedicineCategory(@Param('id') id: string): Promise<void> {
    return this.medicineCategoryService.deleteMedicineCategory(id);
  }
}

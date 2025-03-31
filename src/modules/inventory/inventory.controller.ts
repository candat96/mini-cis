import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuardDecorator } from '@common/decorators/auth-guard.decorator';
import { InventoryService } from './inventory.service';
import { InventoryQueryDto, PaginatedInventoriesResponseDto } from './dto';

@ApiTags('Inventories')
@Controller('inventories')
@AuthGuardDecorator()
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách tồn kho của tất cả thuốc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách tồn kho được trả về thành công',
    type: PaginatedInventoriesResponseDto,
  })
  async findAll(@Query() query: InventoryQueryDto): Promise<PaginatedInventoriesResponseDto> {
    return this.inventoryService.getAllInventories(query);
  }
} 
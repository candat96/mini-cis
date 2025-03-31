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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateStockInDto,
  PaginatedStockInsResponseDto,
  StockInQueryDto,
  StockInResponseDto,
} from './dto';
import { StockInService } from './stock-in.service';

@ApiTags('Stock Ins')
@Controller('stock-ins')
@AuthGuardDecorator()
@ApiBearerAuth()
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo phiếu nhập kho mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Phiếu nhập kho đã được tạo thành công',
    type: StockInResponseDto,
  })
  async create(
    @Body() createStockInDto: CreateStockInDto,
  ): Promise<StockInResponseDto> {
    return this.stockInService.createStockIn(createStockInDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách phiếu nhập kho theo điều kiện lọc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách phiếu nhập kho được trả về thành công',
    type: PaginatedStockInsResponseDto,
  })
  async findAll(
    @Query() query: StockInQueryDto,
  ): Promise<PaginatedStockInsResponseDto> {
    return this.stockInService.getAllStockIns(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một phiếu nhập kho' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin phiếu nhập kho được trả về thành công',
    type: StockInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phiếu nhập kho',
  })
  async findOne(@Param('id') id: string): Promise<StockInResponseDto> {
    return this.stockInService.getStockInById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa một phiếu nhập kho' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Phiếu nhập kho đã được xóa thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phiếu nhập kho',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockInService.deleteStockIn(id);
  }
}

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
  CreateStockOutDto,
  PaginatedStockOutsResponseDto,
  StockOutQueryDto,
  StockOutResponseDto,
} from './dto';
import { StockOutService } from './stock-out.service';

@ApiTags('Stock Outs')
@Controller('stock-outs')
@AuthGuardDecorator()
@ApiBearerAuth()
export class StockOutController {
  constructor(private readonly stockOutService: StockOutService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo phiếu xuất kho mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Phiếu xuất kho đã được tạo thành công',
    type: StockOutResponseDto,
  })
  async create(
    @Body() createStockOutDto: CreateStockOutDto,
  ): Promise<StockOutResponseDto> {
    return this.stockOutService.createStockOut(createStockOutDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách phiếu xuất kho theo điều kiện lọc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách phiếu xuất kho được trả về thành công',
    type: PaginatedStockOutsResponseDto,
  })
  async findAll(
    @Query() query: StockOutQueryDto,
  ): Promise<PaginatedStockOutsResponseDto> {
    return this.stockOutService.getAllStockOuts(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một phiếu xuất kho' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin phiếu xuất kho được trả về thành công',
    type: StockOutResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phiếu xuất kho',
  })
  async findOne(@Param('id') id: string): Promise<StockOutResponseDto> {
    return this.stockOutService.getStockOutById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa một phiếu xuất kho' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Phiếu xuất kho đã được xóa thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy phiếu xuất kho',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockOutService.deleteStockOut(id);
  }
}

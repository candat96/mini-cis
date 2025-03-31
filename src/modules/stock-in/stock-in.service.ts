import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import {
  CreateStockInDto,
  PaginatedStockInsResponseDto,
  StockInQueryDto,
  StockInResponseDto,
} from './dto';
import { Inventory } from '../database/entities/inventory.entity';
import { Medicine } from '../database/entities/medicine.entity';
import { StockInDetail } from '../database/entities/stock-in-detail.entity';
import { StockIn } from '../database/entities/stock-in.entity';

@Injectable()
export class StockInService {
  constructor(
    @InjectRepository(StockIn)
    private readonly stockInRepository: Repository<StockIn>,
    @InjectRepository(StockInDetail)
    private readonly stockInDetailRepository: Repository<StockInDetail>,
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async createStockIn(
    createStockInDto: CreateStockInDto,
  ): Promise<StockInResponseDto> {
    // Nếu không có mã, tự động tạo mã
    if (!createStockInDto.code) {
      createStockInDto.code = await this.generateStockInCode();
    } else {
      // Kiểm tra mã phiếu nhập đã tồn tại chưa
      const existingStockIn = await this.stockInRepository.findOne({
        where: { code: createStockInDto.code },
      });

      if (existingStockIn) {
        throw new ConflictException(
          `Mã phiếu nhập ${createStockInDto.code} đã tồn tại`,
        );
      }
    }

    // Tính tổng tiền
    let totalAmount = 0;
    const details = [];

    // Validate và xử lý các chi tiết phiếu nhập
    for (const detail of createStockInDto.details) {
      // Kiểm tra thuốc có tồn tại không
      const medicine = await this.medicineRepository.findOne({
        where: { id: detail.medicineId },
      });

      if (!medicine) {
        throw new NotFoundException(
          `Không tìm thấy thuốc với ID: ${detail.medicineId}`,
        );
      }

      // Tính thành tiền cho từng dòng
      const amount = detail.quantity * detail.unitPrice;
      totalAmount += amount;

      details.push({
        medicineId: detail.medicineId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        amount,
        expiryDate: detail.expiryDate,
        batchNumber: detail.batchNumber,
      });
    }

    // Tạo phiếu nhập kho
    const stockIn = this.stockInRepository.create({
      code: createStockInDto.code,
      stockInDate: createStockInDto.stockInDate,
      supplier: createStockInDto.supplier,
      note: createStockInDto.note,
      totalAmount,
      details,
    });

    const savedStockIn = await this.stockInRepository.save(stockIn);

    // Cập nhật tồn kho
    await this.updateInventory(savedStockIn);

    return this.getStockInById(savedStockIn.id);
  }

  async getAllStockIns(
    query: StockInQueryDto,
  ): Promise<PaginatedStockInsResponseDto> {
    const { page = 1, limit = 10, code, supplier, fromDate, toDate } = query;

    const queryBuilder = this.stockInRepository
      .createQueryBuilder('stockIn')
      .leftJoinAndSelect('stockIn.details', 'details')
      .leftJoinAndSelect('details.medicine', 'medicine')
      .orderBy('stockIn.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (code) {
      queryBuilder.andWhere('stockIn.code LIKE :code', { code: `%${code}%` });
    }

    if (supplier) {
      queryBuilder.andWhere('stockIn.supplier LIKE :supplier', {
        supplier: `%${supplier}%`,
      });
    }

    if (fromDate) {
      queryBuilder.andWhere('DATE(stockIn.stockInDate) >= DATE(:fromDate)', {
        fromDate,
      });
    }

    if (toDate) {
      queryBuilder.andWhere('DATE(stockIn.stockInDate) <= DATE(:toDate)', {
        toDate,
      });
    }

    const [stockIns, total] = await queryBuilder.getManyAndCount();
    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(StockInResponseDto, stockIns),
      total,
      page,
      limit,
      pageCount,
    };
  }

  async getStockInById(id: string): Promise<StockInResponseDto> {
    const stockIn = await this.stockInRepository.findOne({
      where: { id },
      relations: ['details', 'details.medicine'],
    });

    if (!stockIn) {
      throw new NotFoundException(`Không tìm thấy phiếu nhập kho với ID: ${id}`);
    }

    return plainToInstance(StockInResponseDto, stockIn);
  }

  async deleteStockIn(id: string): Promise<void> {
    const stockIn = await this.getStockInById(id);

    // Xóa phiếu nhập kho
    await this.stockInRepository.remove(stockIn as StockIn);

    // TODO: Cân nhắc việc điều chỉnh lại tồn kho sau khi xóa phiếu nhập
  }

  /**
   * Tự động tạo mã phiếu nhập theo định dạng NK0001, NK0002...
   */
  private async generateStockInCode(): Promise<string> {
    // Lấy mã phiếu nhập cuối cùng
    const lastStockIn = await this.stockInRepository.find({
      where: {
        code: ILike('NK%'),
      },
      order: {
        code: 'DESC',
      },
      take: 1,
    });

    let newCode = 'NK0001';

    if (lastStockIn.length > 0) {
      const lastCode = lastStockIn[0].code;
      // Lấy số từ mã cuối cùng
      const numericPart = lastCode.replace('NK', '');
      const nextNumber = parseInt(numericPart) + 1;

      // Tạo mã mới với padding số 0
      newCode = `NK${nextNumber.toString().padStart(4, '0')}`;
    }

    return newCode;
  }

  /**
   * Cập nhật tồn kho sau khi nhập hàng
   */
  private async updateInventory(stockIn: StockIn): Promise<void> {
    for (const detail of stockIn.details) {
      // Tìm tồn kho hiện tại của thuốc theo lô
      let inventory = await this.inventoryRepository.findOne({
        where: {
          medicineId: detail.medicineId,
          batchNumber: detail.batchNumber || '', // Sử dụng chuỗi rỗng nếu không có số lô
        },
      });

      if (inventory) {
        // Nếu đã tồn tại, cập nhật số lượng và giá trung bình
        const totalValue =
          inventory.quantity * inventory.averageCost + detail.amount;
        const newQuantity = inventory.quantity + detail.quantity;
        const newAverageCost = totalValue / newQuantity;

        inventory.quantity = newQuantity;
        inventory.averageCost = newAverageCost;

        if (detail.expiryDate) {
          // Cập nhật ngày hết hạn nếu mới hơn
          if (
            !inventory.expiryDate ||
            new Date(detail.expiryDate) > new Date(inventory.expiryDate)
          ) {
            inventory.expiryDate = detail.expiryDate;
          }
        }
      } else {
        // Nếu chưa tồn tại, tạo mới
        inventory = this.inventoryRepository.create({
          medicineId: detail.medicineId,
          quantity: detail.quantity,
          averageCost: detail.unitPrice,
          expiryDate: detail.expiryDate,
          batchNumber: detail.batchNumber || '', // Sử dụng chuỗi rỗng nếu không có số lô
        });
      }

      await this.inventoryRepository.save(inventory);
    }
  }
}

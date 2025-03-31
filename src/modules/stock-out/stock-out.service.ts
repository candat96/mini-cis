import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { StockOut } from '../database/entities/stock-out.entity';
import { StockOutDetail } from '../database/entities/stock-out-detail.entity';
import { Medicine } from '../database/entities/medicine.entity';
import { Inventory } from '../database/entities/inventory.entity';
import {
  CreateStockOutDto,
  PaginatedStockOutsResponseDto,
  StockOutQueryDto,
  StockOutResponseDto,
} from './dto';

@Injectable()
export class StockOutService {
  constructor(
    @InjectRepository(StockOut)
    private readonly stockOutRepository: Repository<StockOut>,
    @InjectRepository(StockOutDetail)
    private readonly stockOutDetailRepository: Repository<StockOutDetail>,
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async createStockOut(createStockOutDto: CreateStockOutDto): Promise<StockOutResponseDto> {
    // Nếu không có mã, tự động tạo mã
    if (!createStockOutDto.code) {
      createStockOutDto.code = await this.generateStockOutCode();
    } else {
      // Kiểm tra mã phiếu xuất đã tồn tại chưa
      const existingStockOut = await this.stockOutRepository.findOne({
        where: { code: createStockOutDto.code },
      });

      if (existingStockOut) {
        throw new ConflictException(`Mã phiếu xuất ${createStockOutDto.code} đã tồn tại`);
      }
    }

    // Tính tổng tiền
    let totalAmount = 0;
    const details = [];

    // Validate và xử lý các chi tiết phiếu xuất
    for (const detail of createStockOutDto.details) {
      // Kiểm tra thuốc có tồn tại không
      const medicine = await this.medicineRepository.findOne({
        where: { id: detail.medicineId },
      });

      if (!medicine) {
        throw new NotFoundException(`Không tìm thấy thuốc với ID: ${detail.medicineId}`);
      }

      // Kiểm tra tồn kho
      await this.checkInventory(detail.medicineId, detail.quantity, detail.batchNumber);

      // Tính thành tiền cho từng dòng
      const amount = detail.quantity * detail.unitPrice;
      totalAmount += amount;

      details.push({
        medicineId: detail.medicineId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        amount,
        batchNumber: detail.batchNumber || '',
      });
    }

    // Tạo phiếu xuất kho
    const stockOut = this.stockOutRepository.create({
      code: createStockOutDto.code,
      stockOutDate: createStockOutDto.stockOutDate,
      recipient: createStockOutDto.recipient,
      note: createStockOutDto.note,
      totalAmount,
      details,
    });

    const savedStockOut = await this.stockOutRepository.save(stockOut);

    // Cập nhật tồn kho
    await this.updateInventory(savedStockOut);

    return this.getStockOutById(savedStockOut.id);
  }

  async getAllStockOuts(query: StockOutQueryDto): Promise<PaginatedStockOutsResponseDto> {
    const { page = 1, limit = 10, code, recipient, fromDate, toDate } = query;

    const queryBuilder = this.stockOutRepository.createQueryBuilder('stockOut')
      .leftJoinAndSelect('stockOut.details', 'details')
      .leftJoinAndSelect('details.medicine', 'medicine')
      .orderBy('stockOut.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (code) {
      queryBuilder.andWhere('stockOut.code LIKE :code', { code: `%${code}%` });
    }

    if (recipient) {
      queryBuilder.andWhere('stockOut.recipient LIKE :recipient', { recipient: `%${recipient}%` });
    }

    if (fromDate) {
      queryBuilder.andWhere('DATE(stockOut.stockOutDate) >= DATE(:fromDate)', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('DATE(stockOut.stockOutDate) <= DATE(:toDate)', { toDate });
    }

    const [stockOuts, total] = await queryBuilder.getManyAndCount();
    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(StockOutResponseDto, stockOuts),
      total,
      page,
      limit,
      pageCount,
    };
  }

  async getStockOutById(id: string): Promise<StockOutResponseDto> {
    const stockOut = await this.stockOutRepository.findOne({
      where: { id },
      relations: ['details', 'details.medicine'],
    });

    if (!stockOut) {
      throw new NotFoundException(`Không tìm thấy phiếu xuất kho với ID: ${id}`);
    }

    return plainToInstance(StockOutResponseDto, stockOut);
  }

  async deleteStockOut(id: string): Promise<void> {
    const stockOut = await this.getStockOutById(id);

    // Xóa phiếu xuất kho
    await this.stockOutRepository.remove(stockOut as StockOut);
    
    // TODO: Cân nhắc việc điều chỉnh lại tồn kho sau khi xóa phiếu xuất
  }

  /**
   * Tự động tạo mã phiếu xuất theo định dạng XK0001, XK0002...
   */
  private async generateStockOutCode(): Promise<string> {
    // Lấy mã phiếu xuất cuối cùng
    const lastStockOut = await this.stockOutRepository.find({
      where: {
        code: ILike('XK%'),
      },
      order: {
        code: 'DESC',
      },
      take: 1,
    });

    let newCode = 'XK0001';

    if (lastStockOut.length > 0) {
      const lastCode = lastStockOut[0].code;
      // Lấy số từ mã cuối cùng
      const numericPart = lastCode.replace('XK', '');
      const nextNumber = parseInt(numericPart) + 1;

      // Tạo mã mới với padding số 0
      newCode = `XK${nextNumber.toString().padStart(4, '0')}`;
    }

    return newCode;
  }

  /**
   * Kiểm tra tồn kho trước khi xuất hàng
   */
  private async checkInventory(medicineId: string, quantity: number, batchNumber: string = ''): Promise<void> {
    let query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.medicineId = :medicineId', { medicineId });

    if (batchNumber) {
      query = query.andWhere('inventory.batchNumber = :batchNumber', { batchNumber });
    }

    const inventories = await query.getMany();

    if (inventories.length === 0) {
      throw new BadRequestException(`Không tìm thấy thuốc trong kho với ID: ${medicineId}`);
    }

    // Nếu chỉ định số lô, kiểm tra số lượng trong lô đó
    if (batchNumber) {
      const inventory = inventories[0];
      if (inventory.quantity < quantity) {
        throw new BadRequestException(
          `Số lượng xuất (${quantity}) vượt quá số lượng tồn kho (${inventory.quantity}) cho thuốc với ID: ${medicineId} và số lô: ${batchNumber}`
        );
      }
    } else {
      // Nếu không chỉ định số lô, kiểm tra tổng số lượng
      const totalQuantity = inventories.reduce((sum, item) => sum + item.quantity, 0);
      if (totalQuantity < quantity) {
        throw new BadRequestException(
          `Số lượng xuất (${quantity}) vượt quá tổng số lượng tồn kho (${totalQuantity}) cho thuốc với ID: ${medicineId}`
        );
      }
    }
  }

  /**
   * Cập nhật tồn kho sau khi xuất hàng
   */
  private async updateInventory(stockOut: StockOut): Promise<void> {
    for (const detail of stockOut.details) {
      let remainingQuantity = detail.quantity;
      
      // Nếu có chỉ định số lô, cập nhật số lượng từ lô đó
      if (detail.batchNumber) {
        const inventory = await this.inventoryRepository.findOne({
          where: {
            medicineId: detail.medicineId,
            batchNumber: detail.batchNumber,
          },
        });

        if (inventory) {
          inventory.quantity -= remainingQuantity;
          await this.inventoryRepository.save(inventory);
          continue;
        }
      }

      // Nếu không chỉ định số lô hoặc không tìm thấy lô, lấy từ các lô theo FIFO (sắp xếp theo ngày hết hạn)
      const inventories = await this.inventoryRepository.find({
        where: {
          medicineId: detail.medicineId,
        },
        order: {
          expiryDate: 'ASC',
          createdAt: 'ASC',
        },
      });

      for (const inventory of inventories) {
        if (remainingQuantity <= 0) break;

        if (inventory.quantity >= remainingQuantity) {
          inventory.quantity -= remainingQuantity;
          remainingQuantity = 0;
        } else {
          remainingQuantity -= inventory.quantity;
          inventory.quantity = 0;
        }

        await this.inventoryRepository.save(inventory);
      }

      if (remainingQuantity > 0) {
        throw new BadRequestException(
          `Không đủ số lượng trong kho cho thuốc với ID: ${detail.medicineId}`
        );
      }
    }
  }
} 
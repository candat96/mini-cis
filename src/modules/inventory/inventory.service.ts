import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Inventory } from '../database/entities/inventory.entity';
import { Medicine } from '../database/entities/medicine.entity';
import { InventoryQueryDto, PaginatedInventoriesResponseDto, InventoryResponseDto } from './dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  async getAllInventories(query: InventoryQueryDto): Promise<PaginatedInventoriesResponseDto> {
    const { page = 1, limit = 10, medicineId, medicineName, medicineCode, expiryDays } = query;

    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.medicine', 'medicine')
      .where('inventory.quantity > 0') // Chỉ lấy các bản ghi còn tồn kho
      .orderBy('medicine.name', 'ASC')
      .addOrderBy('inventory.expiryDate', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (medicineId) {
      queryBuilder.andWhere('inventory.medicineId = :medicineId', { medicineId });
    }

    if (medicineName) {
      queryBuilder.andWhere('LOWER(medicine.name) LIKE LOWER(:medicineName)', { medicineName: `%${medicineName}%` });
    }

    if (medicineCode) {
      queryBuilder.andWhere('LOWER(medicine.code) LIKE LOWER(:medicineCode)', { medicineCode: `%${medicineCode}%` });
    }

    if (expiryDays) {
      // Lọc các thuốc sắp hết hạn trong số ngày cụ thể
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + expiryDays);
      
      queryBuilder.andWhere('inventory.expiryDate IS NOT NULL')
                 .andWhere('inventory.expiryDate <= :futureDate', { futureDate });
    }

    const [inventories, total] = await queryBuilder.getManyAndCount();
    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(InventoryResponseDto, inventories),
      total,
      page,
      limit,
      pageCount,
    };
  }
} 
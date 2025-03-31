import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import {
  CreateMedicineDto,
  MedicineQueryDto,
  MedicineResponseDto,
  PaginatedMedicinesResponseDto,
  UpdateMedicineDto,
} from './dto';
import { MedicineCategory } from '../database/entities/medicine-category.entity';
import { Medicine } from '../database/entities/medicine.entity';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
    @InjectRepository(MedicineCategory)
    private readonly medicineCategoryRepository: Repository<MedicineCategory>,
  ) {}

  async createMedicine(
    createMedicineDto: CreateMedicineDto,
  ): Promise<MedicineResponseDto> {
    // Nếu không có mã, tự động tạo mã
    if (!createMedicineDto.code) {
      createMedicineDto.code = await this.generateMedicineCode();
    } else {
      // Kiểm tra mã thuốc đã tồn tại chưa
      const existingMedicine = await this.medicineRepository.findOne({
        where: { code: createMedicineDto.code },
      });

      if (existingMedicine) {
        throw new ConflictException(`Mã thuốc ${createMedicineDto.code} đã tồn tại`);
      }
    }

    // Kiểm tra phân loại thuốc có tồn tại không
    const category = await this.medicineCategoryRepository.findOne({
      where: { id: createMedicineDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Không tìm thấy phân loại thuốc với ID: ${createMedicineDto.categoryId}`,
      );
    }

    const medicine = this.medicineRepository.create({
      name: createMedicineDto.name,
      code: createMedicineDto.code,
      unit: createMedicineDto.unit,
      sellPrice: createMedicineDto.sellPrice,
      buyPrice: createMedicineDto.buyPrice,
      manufacturer: createMedicineDto.manufacturer,
      description: createMedicineDto.description,
      category: category,
    });

    const savedMedicine = await this.medicineRepository.save(medicine);
    return this.getMedicineById(savedMedicine.id);
  }

  /**
   * Tự động tạo mã thuốc theo định dạng T0001, T0002...
   */
  private async generateMedicineCode(): Promise<string> {
    // Lấy mã thuốc cuối cùng
    const lastMedicine = await this.medicineRepository.find({
      where: {
        code: ILike('T%'),
      },
      order: {
        code: 'DESC',
      },
      take: 1,
    });

    let newCode = 'T0001';

    if (lastMedicine.length > 0) {
      const lastCode = lastMedicine[0].code;
      // Lấy số từ mã cuối cùng
      const numericPart = lastCode.replace('T', '');
      const nextNumber = parseInt(numericPart) + 1;

      // Tạo mã mới với padding số 0
      newCode = `T${nextNumber.toString().padStart(4, '0')}`;
    }

    return newCode;
  }

  async getAllMedicines(
    query: MedicineQueryDto,
  ): Promise<PaginatedMedicinesResponseDto> {
    const { page = 1, limit = 10, name, code, categoryId, manufacturer } = query;

    const queryBuilder = this.medicineRepository
      .createQueryBuilder('medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .orderBy('medicine.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (name) {
      queryBuilder.andWhere('medicine.name LIKE :name', { name: `%${name}%` });
    }

    if (code) {
      queryBuilder.andWhere('medicine.code LIKE :code', { code: `%${code}%` });
    }

    if (categoryId) {
      queryBuilder.andWhere('medicine.category = :categoryId', { categoryId });
    }

    if (manufacturer) {
      queryBuilder.andWhere('medicine.manufacturer LIKE :manufacturer', {
        manufacturer: `%${manufacturer}%`,
      });
    }

    const [medicines, total] = await queryBuilder.getManyAndCount();
    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(MedicineResponseDto, medicines),
      total,
      page,
      limit,
      pageCount,
    };
  }

  async getMedicineById(id: string): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!medicine) {
      throw new NotFoundException(`Không tìm thấy thuốc với ID: ${id}`);
    }

    return plainToInstance(MedicineResponseDto, medicine);
  }

  async updateMedicine(
    id: string,
    updateMedicineDto: UpdateMedicineDto,
  ): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!medicine) {
      throw new NotFoundException(`Không tìm thấy thuốc với ID: ${id}`);
    }

    // Kiểm tra nếu code được cập nhật, đảm bảo không trùng lặp
    if (updateMedicineDto.code && updateMedicineDto.code !== medicine.code) {
      const existingMedicine = await this.medicineRepository.findOne({
        where: { code: updateMedicineDto.code },
      });

      if (existingMedicine) {
        throw new ConflictException(`Mã thuốc ${updateMedicineDto.code} đã tồn tại`);
      }
    }

    // Kiểm tra nếu categoryId được cập nhật
    if (updateMedicineDto.categoryId) {
      const category = await this.medicineCategoryRepository.findOne({
        where: { id: updateMedicineDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Không tìm thấy phân loại thuốc với ID: ${updateMedicineDto.categoryId}`,
        );
      }

      medicine.category = category;
      delete updateMedicineDto.categoryId;
    }

    Object.assign(medicine, updateMedicineDto);
    await this.medicineRepository.save(medicine);
    return this.getMedicineById(id);
  }

  async deleteMedicine(id: string): Promise<void> {
    const result = await this.medicineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy thuốc với ID: ${id}`);
    }
  }
}

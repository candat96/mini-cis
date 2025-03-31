import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MedicineCategory } from '../database/entities/medicine-category.entity';
import {
  CreateMedicineCategoryDto,
  MedicineCategoryQueryDto,
  MedicineCategoryResponseDto,
  PaginatedMedicineCategoriesResponseDto,
  UpdateMedicineCategoryDto,
} from './dto';

@Injectable()
export class MedicineCategoryService {
  constructor(
    @InjectRepository(MedicineCategory)
    private readonly medicineCategoryRepository: Repository<MedicineCategory>,
  ) {}

  async createMedicineCategory(
    createMedicineCategoryDto: CreateMedicineCategoryDto,
  ): Promise<MedicineCategoryResponseDto> {
    // Nếu không có mã, tự động tạo mã
    if (!createMedicineCategoryDto.code) {
      createMedicineCategoryDto.code = await this.generateCategoryCode();
    } else {
      // Kiểm tra mã phân loại thuốc đã tồn tại chưa
      const existingCategory = await this.medicineCategoryRepository.findOne({
        where: { code: createMedicineCategoryDto.code },
      });

      if (existingCategory) {
        throw new ConflictException(`Mã phân loại thuốc ${createMedicineCategoryDto.code} đã tồn tại`);
      }
    }

    const medicineCategory = this.medicineCategoryRepository.create(createMedicineCategoryDto);
    const savedCategory = await this.medicineCategoryRepository.save(medicineCategory);
    return plainToInstance(MedicineCategoryResponseDto, savedCategory);
  }

  private async generateCategoryCode(): Promise<string> {
    // Lấy mã phân loại thuốc cuối cùng
    const lastCategory = await this.medicineCategoryRepository.find({
      where: {
        code: ILike('MC%'),
      },
      order: {
        code: 'DESC',
      },
      take: 1,
    });

    let newCode = 'MC001';

    if (lastCategory.length > 0) {
      const lastCode = lastCategory[0].code;
      // Lấy số từ mã cuối cùng
      const numericPart = lastCode.replace('MC', '');
      const nextNumber = parseInt(numericPart) + 1;

      // Tạo mã mới với padding số 0
      newCode = `MC${nextNumber.toString().padStart(3, '0')}`;
    }

    return newCode;
  }

  async getAllMedicineCategories(
    query: MedicineCategoryQueryDto,
  ): Promise<PaginatedMedicineCategoriesResponseDto> {
    const { page = 1, limit = 10, name, code } = query;

    const whereConditions = {};

    if (name) {
      whereConditions['name'] = ILike(`%${name}%`);
    }

    if (code) {
      whereConditions['code'] = ILike(`%${code}%`);
    }

    const [categories, total] = await this.medicineCategoryRepository.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(MedicineCategoryResponseDto, categories),
      total,
      page,
      limit,
      pageCount,
    };
  }

  async getMedicineCategoryById(id: string): Promise<MedicineCategoryResponseDto> {
    const category = await this.medicineCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy phân loại thuốc với ID: ${id}`);
    }
    return plainToInstance(MedicineCategoryResponseDto, category);
  }

  async updateMedicineCategory(
    id: string,
    updateMedicineCategoryDto: UpdateMedicineCategoryDto,
  ): Promise<MedicineCategoryResponseDto> {
    const category = await this.medicineCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy phân loại thuốc với ID: ${id}`);
    }

    // Kiểm tra nếu code được cập nhật, đảm bảo không trùng lặp
    if (
      updateMedicineCategoryDto.code &&
      updateMedicineCategoryDto.code !== category.code
    ) {
      const existingCategory = await this.medicineCategoryRepository.findOne({
        where: { code: updateMedicineCategoryDto.code },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Mã phân loại thuốc ${updateMedicineCategoryDto.code} đã tồn tại`,
        );
      }
    }

    Object.assign(category, updateMedicineCategoryDto);
    const updatedCategory = await this.medicineCategoryRepository.save(category);
    return plainToInstance(MedicineCategoryResponseDto, updatedCategory);
  }

  async deleteMedicineCategory(id: string): Promise<void> {
    const result = await this.medicineCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy phân loại thuốc với ID: ${id}`);
    }
  }
} 
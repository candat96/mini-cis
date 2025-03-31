import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ServiceCategory } from '../database/entities/service-category.entity';
import {
  CreateServiceCategoryDto,
  PaginatedServiceCategoriesResponseDto,
  ServiceCategoryQueryDto,
  ServiceCategoryResponseDto,
  UpdateServiceCategoryDto,
} from './dto';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}

  async createServiceCategory(
    createServiceCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    // Nếu không có mã, tự động tạo mã
    if (!createServiceCategoryDto.code) {
      createServiceCategoryDto.code = await this.generateCategoryCode();
    } else {
      // Kiểm tra mã loại dịch vụ đã tồn tại chưa
      const existingCategory = await this.serviceCategoryRepository.findOne({
        where: { code: createServiceCategoryDto.code },
      });

      if (existingCategory) {
        throw new ConflictException(`Mã loại dịch vụ ${createServiceCategoryDto.code} đã tồn tại`);
      }
    }

    const serviceCategory = this.serviceCategoryRepository.create(createServiceCategoryDto);
    const savedCategory = await this.serviceCategoryRepository.save(serviceCategory);
    return plainToInstance(ServiceCategoryResponseDto, savedCategory);
  }

  /**
   * Tự động tạo mã loại dịch vụ theo định dạng LDV001, LDV002...
   */
  private async generateCategoryCode(): Promise<string> {
    // Lấy mã loại dịch vụ cuối cùng
    const lastCategory = await this.serviceCategoryRepository.find({
      where: {
        code: ILike('LDV%'),
      },
      order: {
        code: 'DESC',
      },
      take: 1,
    });

    let newCode = 'LDV001';

    if (lastCategory.length > 0) {
      const lastCode = lastCategory[0].code;
      // Lấy số từ mã cuối cùng
      const numericPart = lastCode.replace('LDV', '');
      const nextNumber = parseInt(numericPart) + 1;

      // Tạo mã mới với padding số 0
      newCode = `LDV${nextNumber.toString().padStart(3, '0')}`;
    }

    return newCode;
  }

  async getAllServiceCategories(
    query: ServiceCategoryQueryDto,
  ): Promise<PaginatedServiceCategoriesResponseDto> {
    const { page = 1, limit = 10, name, code } = query;

    const whereConditions = {};

    if (name) {
      whereConditions['name'] = ILike(`%${name}%`);
    }

    if (code) {
      whereConditions['code'] = ILike(`%${code}%`);
    }

    const [categories, total] = await this.serviceCategoryRepository.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(ServiceCategoryResponseDto, categories),
      total,
      page,
      limit,
      pageCount,
    };
  }

  async getServiceCategoryById(id: string): Promise<ServiceCategoryResponseDto> {
    const category = await this.serviceCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy loại dịch vụ với ID: ${id}`);
    }
    return plainToInstance(ServiceCategoryResponseDto, category);
  }

  async updateServiceCategory(
    id: string,
    updateServiceCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    const category = await this.serviceCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy loại dịch vụ với ID: ${id}`);
    }

    // Kiểm tra nếu code được cập nhật, đảm bảo không trùng lặp
    if (
      updateServiceCategoryDto.code &&
      updateServiceCategoryDto.code !== category.code
    ) {
      const existingCategory = await this.serviceCategoryRepository.findOne({
        where: { code: updateServiceCategoryDto.code },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Mã loại dịch vụ ${updateServiceCategoryDto.code} đã tồn tại`,
        );
      }
    }

    Object.assign(category, updateServiceCategoryDto);
    const updatedCategory = await this.serviceCategoryRepository.save(category);
    return plainToInstance(ServiceCategoryResponseDto, updatedCategory);
  }

  async deleteServiceCategory(id: string): Promise<void> {
    const result = await this.serviceCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy loại dịch vụ với ID: ${id}`);
    }
  }
} 
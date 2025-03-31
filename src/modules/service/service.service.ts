import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import {
  CreateServiceDto,
  PaginatedServicesResponseDto,
  ServiceQueryDto,
  ServiceResponseDto,
  UpdateServiceDto,
} from './dto';
import { ServiceCategory } from '../database/entities/service-category.entity';
import { Service } from '../database/entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}

  async createService(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    // Nếu không có mã, tự động tạo mã
    if (!createServiceDto.code) {
      createServiceDto.code = await this.generateServiceCode();
    } else {
      // Kiểm tra mã dịch vụ đã tồn tại chưa
      const existingService = await this.serviceRepository.findOne({
        where: { code: createServiceDto.code },
      });

      if (existingService) {
        throw new ConflictException(
          `Mã dịch vụ ${createServiceDto.code} đã tồn tại`,
        );
      }
    }

    // Kiểm tra loại dịch vụ có tồn tại không
    const category = await this.serviceCategoryRepository.findOne({
      where: { id: createServiceDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Không tìm thấy loại dịch vụ với ID: ${createServiceDto.categoryId}`,
      );
    }

    const service = this.serviceRepository.create({
      name: createServiceDto.name,
      code: createServiceDto.code,
      description: createServiceDto.description,
      price: createServiceDto.price,
      category: category,
    });

    const savedService = await this.serviceRepository.save(service);
    return this.getServiceById(savedService.id);
  }

  /**
   * Tự động tạo mã dịch vụ theo định dạng DV0001, DV0002...
   */
  private async generateServiceCode(): Promise<string> {
    // Lấy mã dịch vụ cuối cùng
    const lastService = await this.serviceRepository.find({
      where: {
        code: ILike('DV%'),
      },
      order: {
        code: 'DESC',
      },
      take: 1,
    });

    let newCode = 'DV0001';

    if (lastService.length > 0) {
      const lastCode = lastService[0].code;
      // Lấy số từ mã cuối cùng
      const numericPart = lastCode.replace('DV', '');
      const nextNumber = parseInt(numericPart) + 1;

      // Tạo mã mới với padding số 0
      newCode = `DV${nextNumber.toString().padStart(4, '0')}`;
    }

    return newCode;
  }

  async getAllServices(
    query: ServiceQueryDto,
  ): Promise<PaginatedServicesResponseDto> {
    const { page = 1, limit = 10, name, code, categoryId } = query;

    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .orderBy('service.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (name) {
      queryBuilder.andWhere('service.name LIKE :name', { name: `%${name}%` });
    }

    if (code) {
      queryBuilder.andWhere('service.code LIKE :code', { code: `%${code}%` });
    }

    if (categoryId) {
      queryBuilder.andWhere('service.category = :categoryId', { categoryId });
    }

    const [services, total] = await queryBuilder.getManyAndCount();
    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(ServiceResponseDto, services),
      total,
      page,
      limit,
      pageCount,
    };
  }

  async getServiceById(id: string): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!service) {
      throw new NotFoundException(`Không tìm thấy dịch vụ với ID: ${id}`);
    }

    return plainToInstance(ServiceResponseDto, service);
  }

  async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!service) {
      throw new NotFoundException(`Không tìm thấy dịch vụ với ID: ${id}`);
    }

    // Kiểm tra nếu code được cập nhật, đảm bảo không trùng lặp
    if (updateServiceDto.code && updateServiceDto.code !== service.code) {
      const existingService = await this.serviceRepository.findOne({
        where: { code: updateServiceDto.code },
      });

      if (existingService) {
        throw new ConflictException(
          `Mã dịch vụ ${updateServiceDto.code} đã tồn tại`,
        );
      }
    }

    // Kiểm tra nếu categoryId được cập nhật
    if (updateServiceDto.categoryId) {
      const category = await this.serviceCategoryRepository.findOne({
        where: { id: updateServiceDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Không tìm thấy loại dịch vụ với ID: ${updateServiceDto.categoryId}`,
        );
      }

      service.category = category;
      delete updateServiceDto.categoryId;
    }

    Object.assign(service, updateServiceDto);
    await this.serviceRepository.save(service);
    return this.getServiceById(id);
  }

  async deleteService(id: string): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy dịch vụ với ID: ${id}`);
    }
  }
}

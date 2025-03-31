import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import {
  CreatePatientDto,
  PaginatedPatientsResponseDto,
  PatientQueryDto,
  PatientResponseDto,
  UpdatePatientDto,
} from './dto';
import { Patient } from '../database/entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * Tạo mã bệnh nhân tự động
   * @returns Mã bệnh nhân mới theo định dạng BN000001
   */
  private async generatePatientCode(): Promise<string> {
    // Lấy bệnh nhân có mã lớn nhất
    const lastPatient = await this.patientRepository.findOne({
      order: { code: 'DESC' },
    });

    let nextNumber = 1;
    
    // Nếu đã có bệnh nhân, tăng số lên 1
    if (lastPatient && lastPatient.code) {
      // Lấy phần số từ mã bệnh nhân (bỏ 'BN' ở đầu)
      const lastNumber = parseInt(lastPatient.code.substring(2), 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // Tạo mã mới với định dạng BN + 6 chữ số
    return `BN${nextNumber.toString().padStart(6, '0')}`;
  }

  async createPatient(
    createPatientDto: CreatePatientDto,
  ): Promise<PatientResponseDto> {
    // Tạo mã bệnh nhân tự động
    const code = await this.generatePatientCode();
    
    // Tạo bệnh nhân mới với mã tự động
    const patient = this.patientRepository.create({
      ...createPatientDto,
      code,
    });
    
    const savedPatient = await this.patientRepository.save(patient);
    return plainToInstance(PatientResponseDto, savedPatient);
  }

  async getAllPatients(
    query: PatientQueryDto,
  ): Promise<PaginatedPatientsResponseDto> {
    const { page = 1, limit = 10, name, phone, code } = query;

    const whereConditions = {};

    if (name) {
      whereConditions['name'] = ILike(`%${name}%`);
    }

    if (phone) {
      whereConditions['phone'] = ILike(`%${phone}%`);
    }
    
    if (code) {
      whereConditions['code'] = ILike(`%${code}%`);
    }

    const [patients, total] = await this.patientRepository.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pageCount = Math.ceil(total / limit);

    return {
      items: plainToInstance(PatientResponseDto, patients),
      total,
      page,
      limit,
      pageCount,
    };
  }

  async getPatientById(id: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Không tìm thấy bệnh nhân với ID: ${id}`);
    }
    return plainToInstance(PatientResponseDto, patient);
  }

  async updatePatient(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Không tìm thấy bệnh nhân với ID: ${id}`);
    }

    Object.assign(patient, updatePatientDto);
    const updatedPatient = await this.patientRepository.save(patient);
    return plainToInstance(PatientResponseDto, updatedPatient);
  }

  async deletePatient(id: string): Promise<void> {
    const result = await this.patientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy bệnh nhân với ID: ${id}`);
    }
  }
}

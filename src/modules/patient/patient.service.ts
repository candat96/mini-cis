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

  async createPatient(
    createPatientDto: CreatePatientDto,
  ): Promise<PatientResponseDto> {
    const patient = this.patientRepository.create(createPatientDto);
    const savedPatient = await this.patientRepository.save(patient);
    return plainToInstance(PatientResponseDto, savedPatient);
  }

  async getAllPatients(
    query: PatientQueryDto,
  ): Promise<PaginatedPatientsResponseDto> {
    const { page = 1, limit = 10, name, phone } = query;

    const whereConditions = {};

    if (name) {
      whereConditions['name'] = ILike(`%${name}%`);
    }

    if (phone) {
      whereConditions['phone'] = ILike(`%${phone}%`);
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

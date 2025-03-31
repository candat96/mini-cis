import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../database/entities/appointment.entity';
import { AppointmentDetail } from '../database/entities/appointment-detail.entity';
import { Service } from '../database/entities/service.entity';
import { Patient } from '../database/entities/patient.entity';
import { User } from '../database/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    
    @InjectRepository(AppointmentDetail)
    private appointmentDetailRepository: Repository<AppointmentDetail>,
    
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Check if patient exists
    const patient = await this.patientRepository.findOne({
      where: { id: createAppointmentDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with id ${createAppointmentDto.patientId} not found`);
    }

    // Check if doctor exists if provided
    let doctor = null;
    if (createAppointmentDto.doctorId) {
      doctor = await this.userRepository.findOne({
        where: { id: createAppointmentDto.doctorId },
      });

      if (!doctor) {
        throw new NotFoundException(`Doctor with id ${createAppointmentDto.doctorId} not found`);
      }
    }

    // Create a new appointment
    const appointment = this.appointmentRepository.create({
      patient: { id: createAppointmentDto.patientId },
      patientId: createAppointmentDto.patientId,
      doctor: doctor ? { id: createAppointmentDto.doctorId } : null,
      doctorId: createAppointmentDto.doctorId,
      appointmentDate: createAppointmentDto.appointmentDate,
      note: createAppointmentDto.note,
      status: AppointmentStatus.PENDING,
    });

    // Save appointment to get ID
    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Create appointment details
    let totalAmount = 0;
    const details: AppointmentDetail[] = [];

    for (const serviceItem of createAppointmentDto.services) {
      const service = await this.serviceRepository.findOne({
        where: { id: serviceItem.serviceId },
      });

      if (!service) {
        throw new NotFoundException(`Service with id ${serviceItem.serviceId} not found`);
      }

      const quantity = serviceItem.quantity || 1;
      const amount = service.price * quantity;
      totalAmount += amount;

      const detail = this.appointmentDetailRepository.create({
        appointment: { id: savedAppointment.id },
        appointmentId: savedAppointment.id,
        service: { id: service.id },
        serviceId: service.id,
        price: service.price,
        quantity: quantity,
        amount: amount,
        note: serviceItem.note,
      });

      details.push(detail);
    }

    // Save all details
    await this.appointmentDetailRepository.save(details);

    // Update appointment with total amount
    savedAppointment.totalAmount = totalAmount;
    savedAppointment.details = details;
    await this.appointmentRepository.save(savedAppointment);

    return this.findOne(savedAppointment.id);
  }

  async findAll(query: AppointmentQueryDto): Promise<Appointment[]> {
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.details', 'details')
      .leftJoinAndSelect('details.service', 'service');

    if (query.patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', { patientId: query.patientId });
    }

    if (query.doctorId) {
      queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId: query.doctorId });
    }

    if (query.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: query.status });
    }

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('appointment.appointmentDate BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    } else if (query.startDate) {
      queryBuilder.andWhere('appointment.appointmentDate >= :startDate', {
        startDate: query.startDate,
      });
    } else if (query.endDate) {
      queryBuilder.andWhere('appointment.appointmentDate <= :endDate', {
        endDate: query.endDate,
      });
    }

    if (query.search) {
      queryBuilder.andWhere('(patient.name LIKE :search OR patient.phone LIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    queryBuilder.orderBy('appointment.appointmentDate', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'details', 'details.service'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Update appointment fields
    if (updateAppointmentDto.doctorId) {
      const doctor = await this.userRepository.findOne({
        where: { id: updateAppointmentDto.doctorId },
      });

      if (!doctor) {
        throw new NotFoundException(`Doctor with id ${updateAppointmentDto.doctorId} not found`);
      }

      appointment.doctor = doctor;
      appointment.doctorId = updateAppointmentDto.doctorId;
    }

    if (updateAppointmentDto.appointmentDate) {
      appointment.appointmentDate = updateAppointmentDto.appointmentDate;
    }

    if (updateAppointmentDto.status) {
      appointment.status = updateAppointmentDto.status;
    }

    if (updateAppointmentDto.note !== undefined) {
      appointment.note = updateAppointmentDto.note;
    }

    // Update appointment details if provided
    if (updateAppointmentDto.services && updateAppointmentDto.services.length > 0) {
      let totalAmount = 0;

      // Handle existing details that need to be updated
      const existingDetails = await this.appointmentDetailRepository.find({
        where: { appointmentId: id },
      });

      // Services to keep track of (IDs)
      const updatedServiceIds = updateAppointmentDto.services
        .filter(s => s.id)
        .map(s => s.id);

      // Delete details that are not in the update list
      const detailsToDelete = existingDetails.filter(
        detail => !updatedServiceIds.includes(detail.id)
      );
      
      if (detailsToDelete.length > 0) {
        await this.appointmentDetailRepository.remove(detailsToDelete);
      }

      // Update or create details
      for (const serviceItem of updateAppointmentDto.services) {
        const service = await this.serviceRepository.findOne({
          where: { id: serviceItem.serviceId },
        });

        if (!service) {
          throw new NotFoundException(`Service with id ${serviceItem.serviceId} not found`);
        }

        const quantity = serviceItem.quantity || 1;
        const amount = service.price * quantity;
        totalAmount += amount;

        if (serviceItem.id) {
          // Update existing detail
          const existingDetail = existingDetails.find(d => d.id === serviceItem.id);
          if (existingDetail) {
            existingDetail.service = service;
            existingDetail.serviceId = service.id;
            existingDetail.price = service.price;
            existingDetail.quantity = quantity;
            existingDetail.amount = amount;
            existingDetail.note = serviceItem.note;
            await this.appointmentDetailRepository.save(existingDetail);
          }
        } else {
          // Create new detail
          const newDetail = this.appointmentDetailRepository.create({
            appointment: { id },
            appointmentId: id,
            service: { id: service.id },
            serviceId: service.id,
            price: service.price,
            quantity,
            amount,
            note: serviceItem.note,
          });
          await this.appointmentDetailRepository.save(newDetail);
        }
      }

      // Update total amount
      appointment.totalAmount = totalAmount;
    }

    return this.appointmentRepository.save(appointment);
  }

  /**
   * Cập nhật trạng thái của lịch khám
   * @param id ID của lịch khám
   * @param updateStatusDto DTO chứa trạng thái mới
   * @returns Lịch khám đã cập nhật
   */
  async updateStatus(id: string, updateStatusDto: UpdateAppointmentStatusDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    appointment.status = updateStatusDto.status;
    
    await this.appointmentRepository.save(appointment);
    
    return appointment;
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.softRemove(appointment);
  }
} 
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Appointment } from '../database/entities/appointment.entity';
import { AppointmentDetail } from '../database/entities/appointment-detail.entity';
import { Prescription, PrescriptionStatus } from '../database/entities/prescription.entity';
import { PrescriptionDetail } from '../database/entities/prescription-detail.entity';
import { User } from '../database/entities/user.entity';
import { Service } from '../database/entities/service.entity';
import { StockOut } from '../database/entities/stock-out.entity';
import { StockOutDetail } from '../database/entities/stock-out-detail.entity';
import { UserRole } from '../database/enums/user-role.enum';

import {
  ReportQueryDto,
  TotalRevenueResponseDto,
  DoctorRevenueResponseDto,
  DoctorServiceRevenueResponseDto,
  DoctorMedicineRevenueResponseDto,
  DoctorSummaryDto,
  ServiceSummaryDto,
  MedicineSummaryDto,
} from './dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(AppointmentDetail)
    private readonly appointmentDetailRepository: Repository<AppointmentDetail>,

    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,

    @InjectRepository(PrescriptionDetail)
    private readonly prescriptionDetailRepository: Repository<PrescriptionDetail>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(StockOut)
    private readonly stockOutRepository: Repository<StockOut>,

    @InjectRepository(StockOutDetail)
    private readonly stockOutDetailRepository: Repository<StockOutDetail>,
  ) {}

  /**
   * Lấy báo cáo doanh thu tổng hợp (dịch vụ và thuốc)
   */
  async getTotalRevenue(query: ReportQueryDto): Promise<TotalRevenueResponseDto> {
    // Xử lý ngày tháng
    const fromDate = query.fromDate ? new Date(query.fromDate) : new Date(new Date().getFullYear(), 0, 1);
    const toDate = query.toDate ? new Date(query.toDate) : new Date();
    
    // Đảm bảo toDate là cuối ngày
    toDate.setHours(23, 59, 59, 999);

    // Lấy doanh thu từ dịch vụ (qua bảng AppointmentDetail)
    const appointmentDetails = await this.appointmentDetailRepository
      .createQueryBuilder('ad')
      .leftJoin('ad.appointment', 'a')
      .leftJoin('ad.service', 's')
      .select('SUM(ad.price * ad.quantity)', 'serviceRevenue')
      .addSelect('COUNT(DISTINCT a.id)', 'appointmentCount')
      .where('a.appointmentDate BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .getRawOne();

    // Lấy doanh thu từ thuốc (qua bảng PrescriptionDetail và Prescription)
    const prescriptionDetails = await this.prescriptionDetailRepository
      .createQueryBuilder('pd')
      .leftJoin('pd.prescription', 'p')
      .select('SUM(pd.price * pd.quantity)', 'medicineRevenue')
      .addSelect('COUNT(DISTINCT p.id)', 'prescriptionCount')
      // .where('p.status = :status', { status: PrescriptionStatus.COMPLETED })
      .andWhere('p.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .getRawOne();

    const serviceRevenue = Number(appointmentDetails?.serviceRevenue || 0);
    const medicineRevenue = Number(prescriptionDetails?.medicineRevenue || 0);
    const totalRevenue = serviceRevenue + medicineRevenue;
    const appointmentCount = Number(appointmentDetails?.appointmentCount || 0);
    const prescriptionCount = Number(prescriptionDetails?.prescriptionCount || 0);

    return plainToInstance(TotalRevenueResponseDto, {
      serviceRevenue,
      medicineRevenue,
      totalRevenue,
      appointmentCount,
      prescriptionCount,
      fromDate,
      toDate,
    });
  }

  /**
   * Lấy báo cáo doanh thu tổng hợp theo bác sĩ
   */
  async getDoctorRevenue(query: ReportQueryDto): Promise<DoctorRevenueResponseDto> {
    // Xử lý ngày tháng
    const fromDate = query.fromDate ? new Date(query.fromDate) : new Date(new Date().getFullYear(), 0, 1);
    const toDate = query.toDate ? new Date(query.toDate) : new Date();
    
    // Đảm bảo toDate là cuối ngày
    toDate.setHours(23, 59, 59, 999);

    // Lấy danh sách bác sĩ
    const doctors = await this.userRepository.find({
      where: {
        role: In([UserRole.DOCTOR, UserRole.ADMIN]),
      },
    });

    if (doctors.length === 0) {
      return {
        doctors: [],
        totalServiceRevenue: 0,
        totalMedicineRevenue: 0,
        totalRevenue: 0,
        fromDate,
        toDate,
      };
    }

    const doctorSummaries: DoctorSummaryDto[] = [];
    let totalServiceRevenue = 0;
    let totalMedicineRevenue = 0;

    // Tính toán doanh thu cho mỗi bác sĩ
    for (const doctor of doctors) {
      // Lấy doanh thu dịch vụ của bác sĩ
      const serviceRevenue = await this.appointmentDetailRepository
        .createQueryBuilder('ad')
        .leftJoin('ad.appointment', 'a')
        .select('SUM(ad.price * ad.quantity)', 'revenue')
        .addSelect('COUNT(DISTINCT a.id)', 'appointmentCount')
        .where('a.doctorId = :doctorId', { doctorId: doctor.id })
        .andWhere('a.appointmentDate BETWEEN :fromDate AND :toDate', { fromDate, toDate })
        .getRawOne();

      // Lấy doanh thu thuốc của bác sĩ
      const medicineRevenue = await this.prescriptionDetailRepository
        .createQueryBuilder('pd')
        .leftJoin('pd.prescription', 'p')
        .select('SUM(pd.price * pd.quantity)', 'revenue')
        .addSelect('COUNT(DISTINCT p.id)', 'prescriptionCount')
        .where('p.doctorId = :doctorId', { doctorId: doctor.id })
        // .andWhere('p.status = :status', { status: PrescriptionStatus.COMPLETED })
        .andWhere('p.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate })
        .getRawOne();

      const doctorServiceRevenue = Number(serviceRevenue?.revenue || 0);
      const doctorMedicineRevenue = Number(medicineRevenue?.revenue || 0);
      const doctorTotalRevenue = doctorServiceRevenue + doctorMedicineRevenue;
      const appointmentCount = Number(serviceRevenue?.appointmentCount || 0);
      const prescriptionCount = Number(medicineRevenue?.prescriptionCount || 0);

      totalServiceRevenue += doctorServiceRevenue;
      totalMedicineRevenue += doctorMedicineRevenue;

      doctorSummaries.push({
        doctorId: doctor.id,
        username: doctor.username,
        fullname: doctor.fullname || doctor.username,
        serviceRevenue: doctorServiceRevenue,
        medicineRevenue: doctorMedicineRevenue,
        totalRevenue: doctorTotalRevenue,
        appointmentCount,
        prescriptionCount,
      });
    }

    // Sắp xếp theo doanh thu tổng (giảm dần)
    doctorSummaries.sort((a, b) => b.totalRevenue - a.totalRevenue);

    return plainToInstance(DoctorRevenueResponseDto, {
      doctors: doctorSummaries,
      totalServiceRevenue,
      totalMedicineRevenue,
      totalRevenue: totalServiceRevenue + totalMedicineRevenue,
      fromDate,
      toDate,
    });
  }

  /**
   * Lấy báo cáo doanh thu dịch vụ của một bác sĩ
   */
  async getDoctorServiceRevenue(doctorId: string, query: ReportQueryDto): Promise<DoctorServiceRevenueResponseDto> {
    // Xử lý ngày tháng
    const fromDate = query.fromDate ? new Date(query.fromDate) : new Date(new Date().getFullYear(), 0, 1);
    const toDate = query.toDate ? new Date(query.toDate) : new Date();
    
    // Đảm bảo toDate là cuối ngày
    toDate.setHours(23, 59, 59, 999);

    // Lấy thông tin bác sĩ
    const doctor = await this.userRepository.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Không tìm thấy bác sĩ với ID: ${doctorId}`);
    }

    // Lấy danh sách dịch vụ mà bác sĩ đã thực hiện
    const serviceRevenues = await this.appointmentDetailRepository
      .createQueryBuilder('ad')
      .leftJoin('ad.appointment', 'a')
      .leftJoin('ad.service', 's')
      .select('s.id', 'serviceId')
      .addSelect('s.name', 'serviceName')
      .addSelect('ad.price', 'price')
      .addSelect('SUM(ad.quantity)', 'quantity')
      .addSelect('SUM(ad.price * ad.quantity)', 'revenue')
      .where('a.doctorId = :doctorId', { doctorId })
      .andWhere('a.appointmentDate BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .groupBy('s.id')
      .addGroupBy('s.name')
      .addGroupBy('ad.price')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    // Tính tổng số lượng và doanh thu
    let totalQuantity = 0;
    let totalRevenue = 0;

    const services: ServiceSummaryDto[] = serviceRevenues.map(item => {
      const quantity = Number(item.quantity || 0);
      const revenue = Number(item.revenue || 0);
      
      totalQuantity += quantity;
      totalRevenue += revenue;

      return {
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        price: Number(item.price || 0),
        quantity,
        revenue,
      };
    });

    return plainToInstance(DoctorServiceRevenueResponseDto, {
      doctorId: doctor.id,
      username: doctor.username,
      fullname: doctor.fullname || doctor.username,
      services,
      totalQuantity,
      totalRevenue,
      fromDate,
      toDate,
    });
  }

  /**
   * Lấy báo cáo doanh thu thuốc của một bác sĩ
   */
  async getDoctorMedicineRevenue(doctorId: string, query: ReportQueryDto): Promise<DoctorMedicineRevenueResponseDto> {
    // Xử lý ngày tháng
    const fromDate = query.fromDate ? new Date(query.fromDate) : new Date(new Date().getFullYear(), 0, 1);
    const toDate = query.toDate ? new Date(query.toDate) : new Date();
    
    // Đảm bảo toDate là cuối ngày
    toDate.setHours(23, 59, 59, 999);

    // Lấy thông tin bác sĩ
    const doctor = await this.userRepository.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Không tìm thấy bác sĩ với ID: ${doctorId}`);
    }

    // Đếm số đơn thuốc
    const prescriptionCount = await this.prescriptionRepository.count({
      where: {
        doctorId,
        // status: PrescriptionStatus.COMPLETED,
        createdAt: Between(fromDate, toDate),
      },
    });

    // Lấy danh sách thuốc mà bác sĩ đã kê
    const medicineRevenues = await this.prescriptionDetailRepository
      .createQueryBuilder('pd')
      .leftJoin('pd.prescription', 'p')
      .leftJoin('pd.medicine', 'm')
      .select('m.id', 'medicineId')
      .addSelect('m.code', 'code')
      .addSelect('m.name', 'name')
      .addSelect('m.unit', 'unit')
      .addSelect('pd.price', 'price')
      .addSelect('SUM(pd.quantity)', 'quantity')
      .addSelect('SUM(pd.price * pd.quantity)', 'revenue')
      .where('p.doctorId = :doctorId', { doctorId })
      //.andWhere('p.status = :status', { status: PrescriptionStatus.COMPLETED })
      .andWhere('p.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .groupBy('m.id')
      .addGroupBy('m.code')
      .addGroupBy('m.name')
      .addGroupBy('m.unit')
      .addGroupBy('pd.price')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    // Tính tổng số lượng và doanh thu
    let totalQuantity = 0;
    let totalRevenue = 0;

    const medicines: MedicineSummaryDto[] = medicineRevenues.map(item => {
      const quantity = Number(item.quantity || 0);
      const revenue = Number(item.revenue || 0);
      
      totalQuantity += quantity;
      totalRevenue += revenue;

      return {
        medicineId: item.medicineId,
        code: item.code,
        name: item.name,
        unit: item.unit,
        price: Number(item.price || 0),
        quantity,
        revenue,
      };
    });

    return plainToInstance(DoctorMedicineRevenueResponseDto, {
      doctorId: doctor.id,
      username: doctor.username,
      fullname: doctor.fullname || doctor.username,
      medicines,
      totalQuantity,
      totalRevenue,
      prescriptionCount,
      fromDate,
      toDate,
    });
  }
} 
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Between, ILike, In, Repository, MoreThan } from 'typeorm';
import {
  CreatePrescriptionDto,
  PrescriptionResponseDto,
  UpdatePrescriptionDto,
  PrescriptionQueryDto,
  PaginatedPrescriptionsResponseDto,
} from './dto';
import { Prescription, PrescriptionStatus } from '../database/entities/prescription.entity';
import { PrescriptionDetail } from '../database/entities/prescription-detail.entity';
import { Medicine } from '../database/entities/medicine.entity';
import { Appointment } from '../database/entities/appointment.entity';
import { User } from '../database/entities/user.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { StockOut, StockOutType } from '../database/entities/stock-out.entity';
import { StockOutDetail } from '../database/entities/stock-out-detail.entity';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    
    @InjectRepository(PrescriptionDetail)
    private readonly prescriptionDetailRepository: Repository<PrescriptionDetail>,
    
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
    
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    
    @InjectRepository(StockOut)
    private readonly stockOutRepository: Repository<StockOut>,
    
    @InjectRepository(StockOutDetail)
    private readonly stockOutDetailRepository: Repository<StockOutDetail>,
  ) {}

  /**
   * Tạo mới đơn thuốc và phiếu xuất kho
   */
  async createPrescription(createDto: CreatePrescriptionDto): Promise<PrescriptionResponseDto> {
    // Kiểm tra lịch khám có tồn tại không
    const appointment = await this.appointmentRepository.findOne({
      where: { id: createDto.appointmentId },
      relations: ['patient'],
    });
    
    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch khám với ID: ${createDto.appointmentId}`);
    }
    
    // Kiểm tra bác sĩ có tồn tại không
    const doctor = await this.userRepository.findOne({
      where: { id: createDto.doctorId },
    });
    
    if (!doctor) {
      throw new NotFoundException(`Không tìm thấy bác sĩ với ID: ${createDto.doctorId}`);
    }
    
    // Tạo mã đơn thuốc
    const code = await this.generatePrescriptionCode();
    
    // Tạo đơn thuốc mới
    const prescription = this.prescriptionRepository.create({
      code,
      status: PrescriptionStatus.DRAFT,
      note: createDto.note,
      appointmentId: createDto.appointmentId,
      appointment,
      doctorId: createDto.doctorId,
      doctor,
    });
    
    // Lưu đơn thuốc để lấy ID
    const savedPrescription = await this.prescriptionRepository.save(prescription);
    
    // Tạo chi tiết đơn thuốc và tính tổng tiền
    let totalAmount = 0;
    const details: PrescriptionDetail[] = [];
    
    for (const medicineItem of createDto.medicines) {
      // Kiểm tra thuốc có tồn tại không
      const medicine = await this.medicineRepository.findOne({
        where: { id: medicineItem.medicineId },
      });
      
      if (!medicine) {
        throw new NotFoundException(`Không tìm thấy thuốc với ID: ${medicineItem.medicineId}`);
      }
      
      // Kiểm tra tồn kho
      await this.checkInventory(medicineItem.medicineId, medicineItem.quantity);
      
      // Tính thành tiền
      const amount = medicine.sellPrice * medicineItem.quantity;
      totalAmount += amount;
      
      // Tạo chi tiết đơn thuốc
      const detail = this.prescriptionDetailRepository.create({
        prescriptionId: savedPrescription.id,
        prescription: savedPrescription,
        medicineId: medicine.id,
        medicine,
        price: medicine.sellPrice,
        quantity: medicineItem.quantity,
        amount,
        dosage: medicineItem.dosage,
        frequency: medicineItem.frequency,
        duration: medicineItem.duration,
        instruction: medicineItem.instruction,
        note: medicineItem.note,
      });
      
      details.push(detail);
    }
    
    // Lưu chi tiết đơn thuốc
    await this.prescriptionDetailRepository.save(details);
    
    // Cập nhật tổng tiền đơn thuốc
    savedPrescription.totalAmount = totalAmount;
    savedPrescription.details = details;
    await this.prescriptionRepository.save(savedPrescription);
    
    // Tạo phiếu xuất kho
    await this.createStockOut(savedPrescription, appointment.patient.name);
    
    return this.findOne(savedPrescription.id);
  }
  
  /**
   * Lấy danh sách đơn thuốc theo điều kiện lọc
   */
  async findAll(query: PrescriptionQueryDto): Promise<PaginatedPrescriptionsResponseDto> {
    const { page = 1, limit = 10 } = query;
    const conditions: any = {};
    
    if (query.appointmentId) {
      conditions.appointmentId = query.appointmentId;
    }
    
    if (query.doctorId) {
      conditions.doctorId = query.doctorId;
    }
    
    if (query.code) {
      conditions.code = ILike(`%${query.code}%`);
    }
    
    if (query.status) {
      conditions.status = query.status;
    }
    
    if (query.fromDate && query.toDate) {
      conditions.createdAt = Between(
        new Date(query.fromDate),
        new Date(query.toDate),
      );
    } else if (query.fromDate) {
      conditions.createdAt = Between(
        new Date(query.fromDate),
        new Date('2099-12-31'),
      );
    } else if (query.toDate) {
      conditions.createdAt = Between(
        new Date('1900-01-01'),
        new Date(query.toDate),
      );
    }
    
    // Đếm tổng số bản ghi thỏa mãn điều kiện trước
    const total = await this.prescriptionRepository.count({
      where: conditions,
    });
    
    // Lấy dữ liệu với phân trang
    const prescriptions = await this.prescriptionRepository.find({
      where: conditions,
      relations: [
        'appointment',
        'appointment.patient',
        'doctor',
        'details',
        'details.medicine',
      ],
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // Lấy thông tin phiếu xuất kho cho từng đơn thuốc
    for (const prescription of prescriptions) {
      const stockOut = await this.stockOutRepository.findOne({
        where: { prescriptionId: prescription.id },
      });
      
      if (stockOut) {
        (prescription as any).stockOut = stockOut;
      }
    }
    
    // Tính toán số trang
    const pageCount = Math.ceil(total / limit);
    
    // Trả về kết quả đã phân trang
    return {
      items: plainToInstance(PrescriptionResponseDto, prescriptions),
      total,
      page,
      limit,
      pageCount,
    };
  }
  
  /**
   * Lấy thông tin chi tiết của một đơn thuốc
   */
  async findOne(id: string): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: [
        'appointment',
        'appointment.patient',
        'doctor',
        'details',
        'details.medicine',
      ],
    });
    
    if (!prescription) {
      throw new NotFoundException(`Không tìm thấy đơn thuốc với ID: ${id}`);
    }
    
    // Lấy thông tin phiếu xuất kho
    const stockOut = await this.stockOutRepository.findOne({
      where: { prescriptionId: prescription.id },
    });
    
    if (stockOut) {
      (prescription as any).stockOut = stockOut;
    }
    
    return plainToInstance(PrescriptionResponseDto, prescription);
  }
  
  /**
   * Cập nhật đơn thuốc và phiếu xuất kho tương ứng
   */
  async update(id: string, updateDto: UpdatePrescriptionDto): Promise<PrescriptionResponseDto> {
    const prescription = await this.findOne(id);
    
    // Chỉ cho phép cập nhật đơn thuốc ở trạng thái DRAFT
    if (prescription.status !== PrescriptionStatus.DRAFT) {
      throw new BadRequestException(`Không thể cập nhật đơn thuốc đã hoàn thành hoặc đã hủy`);
    }
    
    // Cập nhật thông tin đơn thuốc
    if (updateDto.doctorId) {
      const doctor = await this.userRepository.findOne({
        where: { id: updateDto.doctorId },
      });
      
      if (!doctor) {
        throw new NotFoundException(`Không tìm thấy bác sĩ với ID: ${updateDto.doctorId}`);
      }
      
      prescription.doctorId = updateDto.doctorId;
      prescription.doctor = doctor;
    }
    
    if (updateDto.status) {
      prescription.status = updateDto.status;
    }
    
    if (updateDto.note !== undefined) {
      prescription.note = updateDto.note;
    }
    
    // Cập nhật danh sách thuốc nếu có thay đổi
    if (updateDto.medicines && updateDto.medicines.length > 0) {
      const currentDetails = await this.prescriptionDetailRepository.find({
        where: { prescriptionId: id },
      });
      
      // Lọc ra các ID chi tiết cần giữ lại
      const detailIdsToKeep = updateDto.medicines
        .filter(m => m.id)
        .map(m => m.id);
      
      // Xóa các chi tiết không còn trong danh sách
      const detailsToDelete = currentDetails.filter(
        detail => !detailIdsToKeep.includes(detail.id)
      );
      
      if (detailsToDelete.length > 0) {
        await this.prescriptionDetailRepository.remove(detailsToDelete);
      }
      
      // Cập nhật hoặc thêm mới chi tiết
      let totalAmount = 0;
      
      for (const medicineItem of updateDto.medicines) {
        const medicine = await this.medicineRepository.findOne({
          where: { id: medicineItem.medicineId },
        });
        
        if (!medicine) {
          throw new NotFoundException(`Không tìm thấy thuốc với ID: ${medicineItem.medicineId}`);
        }
        
        // Cập nhật tồn kho (cần kiểm tra lại nếu số lượng thay đổi)
        if (medicineItem.id) {
          // Cập nhật chi tiết đã có
          const existingDetail = currentDetails.find(d => d.id === medicineItem.id);
          
          if (existingDetail) {
            // Nếu số lượng tăng, cần kiểm tra tồn kho cho phần chênh lệch
            if (medicineItem.quantity > existingDetail.quantity) {
              await this.checkInventory(
                medicineItem.medicineId,
                medicineItem.quantity - existingDetail.quantity
              );
            }
            
            const amount = medicine.sellPrice * medicineItem.quantity;
            totalAmount += amount;
            
            // Cập nhật chi tiết
            existingDetail.price = medicine.sellPrice;
            existingDetail.quantity = medicineItem.quantity;
            existingDetail.amount = amount;
            existingDetail.dosage = medicineItem.dosage;
            existingDetail.frequency = medicineItem.frequency;
            existingDetail.duration = medicineItem.duration;
            existingDetail.instruction = medicineItem.instruction;
            existingDetail.note = medicineItem.note;
            
            await this.prescriptionDetailRepository.save(existingDetail);
          }
        } else {
          // Thêm mới chi tiết
          await this.checkInventory(medicineItem.medicineId, medicineItem.quantity);
          
          const amount = medicine.sellPrice * medicineItem.quantity;
          totalAmount += amount;
          
          const newDetail = this.prescriptionDetailRepository.create({
            prescriptionId: id,
            prescription: { id },
            medicineId: medicine.id,
            medicine,
            price: medicine.sellPrice,
            quantity: medicineItem.quantity,
            amount,
            dosage: medicineItem.dosage,
            frequency: medicineItem.frequency,
            duration: medicineItem.duration,
            instruction: medicineItem.instruction,
            note: medicineItem.note,
          });
          
          await this.prescriptionDetailRepository.save(newDetail);
        }
      }
      
      // Cập nhật tổng tiền đơn thuốc
      prescription.totalAmount = totalAmount;
    }
    
    const savedPrescription = await this.prescriptionRepository.save(prescription);
    
    // Cập nhật phiếu xuất kho tương ứng
    await this.updateStockOut(savedPrescription);
    
    return this.findOne(savedPrescription.id);
  }
  
  /**
   * Xóa đơn thuốc và phiếu xuất kho tương ứng
   */
  async remove(id: string): Promise<void> {
    const prescription = await this.findOne(id);
    
    // Chỉ cho phép xóa đơn thuốc ở trạng thái DRAFT
    if (prescription.status !== PrescriptionStatus.DRAFT) {
      throw new BadRequestException(`Không thể xóa đơn thuốc đã hoàn thành hoặc đã hủy`);
    }
    
    // Xóa phiếu xuất kho liên quan
    const stockOut = await this.stockOutRepository.findOne({
      where: { prescriptionId: id },
    });
    
    if (stockOut) {
      // Đảo ngược thay đổi tồn kho
      const stockOutDetails = await this.stockOutDetailRepository.find({
        where: { stockOutId: stockOut.id },
      });
      
      // Cộng lại số lượng vào tồn kho
      for (const detail of stockOutDetails) {
        await this.inventoryRepository.increment(
          { medicineId: detail.medicineId },
          'quantity',
          detail.quantity
        );
      }
      
      // Xóa phiếu xuất kho
      await this.stockOutRepository.remove(stockOut);
    }
    
    // Xóa đơn thuốc
    await this.prescriptionRepository.remove(prescription as Prescription);
  }
  
  /**
   * Tạo mã đơn thuốc tự động theo định dạng DT000001
   */
  private async generatePrescriptionCode(): Promise<string> {
    const lastPrescription = await this.prescriptionRepository.findOne({
      where: { code: ILike('DT%') },
      order: { code: 'DESC' },
    });
    
    let nextNumber = 1;
    
    if (lastPrescription && lastPrescription.code) {
      const lastCode = lastPrescription.code;
      // Lấy phần số từ mã (bỏ 'DT' ở đầu)
      const lastNumber = parseInt(lastCode.substring(2), 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    
    // Tạo mã mới với định dạng DT000001
    return `DT${nextNumber.toString().padStart(6, '0')}`;
  }
  
  /**
   * Kiểm tra tồn kho cho một loại thuốc
   */
  private async checkInventory(medicineId: string, quantity: number): Promise<void> {
    // Tính tổng tồn kho của thuốc
    const inventories = await this.inventoryRepository.find({
      where: { medicineId },
    });
    
    const totalQuantity = inventories.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    
    if (totalQuantity < quantity) {
      throw new BadRequestException(
        `Không đủ số lượng thuốc trong kho. Hiện chỉ còn ${totalQuantity}`
      );
    }
  }
  
  /**
   * Tạo phiếu xuất kho cho đơn thuốc
   */
  private async createStockOut(prescription: Prescription, patientName: string): Promise<StockOut> {
    // Tạo mã phiếu xuất kho
    const lastStockOut = await this.stockOutRepository.findOne({
      where: {
        code: ILike('XK%'),
      },
      order: {
        code: 'DESC',
      },
    });
    
    let code = 'XK0001';
    
    if (lastStockOut && lastStockOut.code) {
      const lastCode = lastStockOut.code;
      const numericPart = lastCode.replace('XK', '');
      const nextNumber = parseInt(numericPart) + 1;
      code = `XK${nextNumber.toString().padStart(4, '0')}`;
    }
    
    // Tạo phiếu xuất kho
    const stockOut = this.stockOutRepository.create({
      code,
      stockOutDate: new Date(),
      recipient: patientName,
      note: `Xuất thuốc theo đơn ${prescription.code}`,
      totalAmount: prescription.totalAmount,
      type: StockOutType.PRESCRIPTION,
      prescriptionId: prescription.id,
      prescription,
    });
    
    const savedStockOut = await this.stockOutRepository.save(stockOut);
    
    // Tạo chi tiết phiếu xuất và cập nhật tồn kho
    for (const detail of prescription.details) {
      const stockOutDetail = this.stockOutDetailRepository.create({
        stockOutId: savedStockOut.id,
        stockOut: savedStockOut,
        medicineId: detail.medicineId,
        medicine: detail.medicine,
        quantity: detail.quantity,
        unitPrice: detail.price,
        amount: detail.amount,
      });
      
      await this.stockOutDetailRepository.save(stockOutDetail);
      
      // Cập nhật tồn kho (giảm số lượng)
      await this.updateInventoryForStockOut(detail.medicineId, detail.quantity);
    }
    
    return savedStockOut;
  }
  
  /**
   * Cập nhật phiếu xuất kho khi cập nhật đơn thuốc
   */
  private async updateStockOut(prescription: Prescription): Promise<void> {
    const stockOut = await this.stockOutRepository.findOne({
      where: { prescriptionId: prescription.id },
      relations: ['details'],
    });
    
    if (!stockOut) {
      // Nếu chưa có phiếu xuất, tạo mới
      const appointment = await this.appointmentRepository.findOne({
        where: { id: prescription.appointmentId },
        relations: ['patient'],
      });
      
      await this.createStockOut(prescription, appointment.patient.name);
      return;
    }
    
    // Cập nhật thông tin phiếu xuất
    stockOut.totalAmount = prescription.totalAmount;
    await this.stockOutRepository.save(stockOut);
    
    // Lấy chi tiết đơn thuốc và chi tiết phiếu xuất
    const prescriptionDetails = await this.prescriptionDetailRepository.find({
      where: { prescriptionId: prescription.id },
    });
    
    const stockOutDetails = await this.stockOutDetailRepository.find({
      where: { stockOutId: stockOut.id },
    });
    
    // Xóa các chi tiết phiếu xuất không còn trong đơn thuốc
    const prescriptionDetailMedicineIds = prescriptionDetails.map(d => d.medicineId);
    const detailsToDelete = stockOutDetails.filter(
      d => !prescriptionDetailMedicineIds.includes(d.medicineId)
    );
    
    if (detailsToDelete.length > 0) {
      // Hoàn lại số lượng vào tồn kho
      for (const detail of detailsToDelete) {
        await this.inventoryRepository.increment(
          { medicineId: detail.medicineId },
          'quantity',
          detail.quantity
        );
      }
      
      await this.stockOutDetailRepository.remove(detailsToDelete);
    }
    
    // Cập nhật hoặc thêm mới chi tiết phiếu xuất
    for (const prescDetail of prescriptionDetails) {
      const existingDetail = stockOutDetails.find(
        d => d.medicineId === prescDetail.medicineId
      );
      
      if (existingDetail) {
        // Nếu số lượng thay đổi, cập nhật tồn kho
        if (existingDetail.quantity !== prescDetail.quantity) {
          const difference = prescDetail.quantity - existingDetail.quantity;
          
          if (difference > 0) {
            // Nếu số lượng tăng, kiểm tra tồn kho và giảm thêm
            await this.checkInventory(prescDetail.medicineId, difference);
            await this.updateInventoryForStockOut(prescDetail.medicineId, difference);
          } else if (difference < 0) {
            // Nếu số lượng giảm, tăng lại tồn kho
            await this.inventoryRepository.increment(
              { medicineId: prescDetail.medicineId },
              'quantity',
              Math.abs(difference)
            );
          }
        }
        
        // Cập nhật chi tiết phiếu xuất
        existingDetail.quantity = prescDetail.quantity;
        existingDetail.unitPrice = prescDetail.price;
        existingDetail.amount = prescDetail.amount;
        await this.stockOutDetailRepository.save(existingDetail);
      } else {
        // Thêm mới chi tiết phiếu xuất
        const newDetail = this.stockOutDetailRepository.create({
          stockOutId: stockOut.id,
          stockOut,
          medicineId: prescDetail.medicineId,
          medicine: prescDetail.medicine,
          quantity: prescDetail.quantity,
          unitPrice: prescDetail.price,
          amount: prescDetail.amount,
        });
        
        await this.stockOutDetailRepository.save(newDetail);
        
        // Giảm tồn kho
        await this.updateInventoryForStockOut(prescDetail.medicineId, prescDetail.quantity);
      }
    }
  }
  
  /**
   * Cập nhật tồn kho khi xuất thuốc
   */
  private async updateInventoryForStockOut(medicineId: string, quantity: number): Promise<void> {
    // Lấy danh sách tồn kho của thuốc, ưu tiên thuốc sắp hết hạn
    const inventories = await this.inventoryRepository.find({
      where: { medicineId, quantity: MoreThan(0) },
      order: { expiryDate: 'ASC' },
    });
    
    let remainingQuantity = quantity;
    
    for (const inventory of inventories) {
      if (remainingQuantity <= 0) break;
      
      const quantityToDeduct = Math.min(remainingQuantity, inventory.quantity);
      inventory.quantity -= quantityToDeduct;
      remainingQuantity -= quantityToDeduct;
      
      await this.inventoryRepository.save(inventory);
    }
  }
} 
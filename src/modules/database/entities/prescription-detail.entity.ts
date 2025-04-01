import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Prescription } from './prescription.entity';
import { Medicine } from './medicine.entity';

@Entity()
export class PrescriptionDetail extends BaseEntity {
  @ManyToOne(() => Prescription, prescription => prescription.details)
  @JoinColumn()
  prescription: Prescription;

  @Column()
  prescriptionId: string;

  @ManyToOne(() => Medicine)
  @JoinColumn()
  medicine: Medicine;

  @Column()
  medicineId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ nullable: true })
  dosage: string; // Liều lượng (VD: 1 viên/lần)

  @Column({ nullable: true })
  frequency: string; // Tần suất (VD: 3 lần/ngày)

  @Column({ nullable: true })
  duration: string; // Thời gian dùng (VD: 5 ngày)

  @Column({ nullable: true })
  instruction: string; // Hướng dẫn sử dụng (VD: Uống sau ăn)

  @Column({ nullable: true })
  note: string; // Ghi chú thêm
} 
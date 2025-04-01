import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StockOutDetail } from './stock-out-detail.entity';
import { Prescription } from './prescription.entity';

// Enum định nghĩa các loại xuất kho
export enum StockOutType {
  PRESCRIPTION = 'PRESCRIPTION', // Xuất cho đơn thuốc
  OTHER = 'OTHER' // Xuất vì lý do khác
}

@Entity()
export class StockOut extends BaseEntity {
  @Column()
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  stockOutDate: Date;

  @Column({ 
    type: 'enum', 
    enum: StockOutType, 
    default: StockOutType.OTHER 
  })
  type: StockOutType;

  @Column({ nullable: true })
  recipient: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @ManyToOne(() => Prescription, { nullable: true })
  @JoinColumn()
  prescription: Prescription;

  @Column({ nullable: true })
  prescriptionId: string;

  @OneToMany(() => StockOutDetail, (detail) => detail.stockOut, { cascade: true })
  details: StockOutDetail[];
}

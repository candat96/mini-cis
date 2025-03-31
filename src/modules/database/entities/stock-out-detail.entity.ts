import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Medicine } from './medicine.entity';
import { StockOut } from './stock-out.entity';

@Entity()
export class StockOutDetail extends BaseEntity {
  @ManyToOne(() => Medicine)
  @JoinColumn()
  medicine: Medicine;

  @Column()
  medicineId: string;

  @ManyToOne(() => StockOut, (stockOut) => stockOut.details, { onDelete: 'CASCADE' })
  @JoinColumn()
  stockOut: StockOut;

  @Column()
  stockOutId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  batchNumber: string;
} 
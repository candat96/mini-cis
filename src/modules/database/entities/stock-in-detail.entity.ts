import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Medicine } from './medicine.entity';
import { StockIn } from './stock-in.entity';

@Entity()
export class StockInDetail extends BaseEntity {
  @ManyToOne(() => Medicine)
  @JoinColumn()
  medicine: Medicine;

  @Column()
  medicineId: string;

  @ManyToOne(() => StockIn, (stockIn) => stockIn.details, { onDelete: 'CASCADE' })
  @JoinColumn()
  stockIn: StockIn;

  @Column()
  stockInId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  batchNumber: string;
}

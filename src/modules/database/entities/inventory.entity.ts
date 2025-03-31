import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Medicine } from './medicine.entity';

@Entity()
@Index(['medicineId', 'batchNumber'], { unique: true })
export class Inventory extends BaseEntity {
  @ManyToOne(() => Medicine)
  @JoinColumn()
  medicine: Medicine;

  @Column()
  medicineId: string;

  @Column()
  quantity: number;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  batchNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageCost: number;
}

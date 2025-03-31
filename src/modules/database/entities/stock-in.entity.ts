import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StockInDetail } from './stock-in-detail.entity';

@Entity()
export class StockIn extends BaseEntity {
  @Column()
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  stockInDate: Date;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @OneToMany(() => StockInDetail, (detail) => detail.stockIn, { cascade: true })
  details: StockInDetail[];
} 
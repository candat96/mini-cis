import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StockOutDetail } from './stock-out-detail.entity';

@Entity()
export class StockOut extends BaseEntity {
  @Column()
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  stockOutDate: Date;

  @Column({ nullable: true })
  recipient: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @OneToMany(() => StockOutDetail, (detail) => detail.stockOut, { cascade: true })
  details: StockOutDetail[];
}

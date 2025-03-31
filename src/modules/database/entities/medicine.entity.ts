import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MedicineCategory } from './medicine-category.entity';

@Entity()
export class Medicine extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  sellPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  buyPrice: number;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => MedicineCategory, (category) => category.medicines)
  category: MedicineCategory;
}

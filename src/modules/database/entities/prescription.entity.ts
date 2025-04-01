import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Appointment } from './appointment.entity';

import { User } from './user.entity';
import { PrescriptionDetail } from './prescription-detail.entity';

export enum PrescriptionStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Prescription extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: PrescriptionStatus, default: PrescriptionStatus.DRAFT })
  status: PrescriptionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Appointment)
  @JoinColumn()
  appointment: Appointment;

  @Column()
  appointmentId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  doctor: User;

  @Column()
  doctorId: string;

  @OneToMany(() => PrescriptionDetail, detail => detail.prescription, { cascade: true })
  details: PrescriptionDetail[];
} 
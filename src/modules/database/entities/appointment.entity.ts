import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { AppointmentDetail } from './appointment-detail.entity';


export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Appointment extends BaseEntity {
  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({ nullable: true })
  note: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @Column()
  patientId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  doctor: User;

  @Column({ nullable: true })
  doctorId: string;

  @OneToMany(() => AppointmentDetail, (detail) => detail.appointment, { cascade: true })
  details: AppointmentDetail[];
} 
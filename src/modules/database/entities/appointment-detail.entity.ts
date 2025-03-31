import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Appointment } from './appointment.entity';
import { Service } from './service.entity';

@Entity()
export class AppointmentDetail extends BaseEntity {
  @ManyToOne(() => Appointment, (appointment) => appointment.details)
  @JoinColumn()
  appointment: Appointment;

  @Column()
  appointmentId: string;

  @ManyToOne(() => Service)
  @JoinColumn()
  service: Service;

  @Column()
  serviceId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
  
  @Column({ default: 1 })
  quantity: number;
  
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;
  
  @Column({ nullable: true })
  note: string;
} 
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Service } from './service.entity';

@Entity()
export class ServiceCategory extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  note: string;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}

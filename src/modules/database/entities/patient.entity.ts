import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Gender } from '../enums/gender.enum';

@Entity()
export class Patient extends BaseEntity {
  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'occupation', nullable: true })
  occupation: string;
}

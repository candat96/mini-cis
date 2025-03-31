import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.RECEPTIONIST,
  })
  role: UserRole;
}

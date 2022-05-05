import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../constants/userRole';
import bcrypt from 'bcryptjs';


@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column({ nullable: true, type: 'date' })
  birthday!: Date;

  @Column({ type: 'varchar', enum: UserRole, default: UserRole.USER })
  role!: string;

  @Column('varchar')
  password!: string;

  @Column({ nullable: true, type: 'varchar' })
    token!: string;
    
  public constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }
}
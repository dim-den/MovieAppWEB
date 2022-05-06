import { Entity, Column,OneToMany } from 'typeorm';
import { UserRole } from '../constants/userRole';
import bcrypt from 'bcryptjs';
import { BaseEntity } from './baseEntity';
import { FilmReview } from './filmReview';

@Entity({ name: 'user' })
export class User extends BaseEntity{

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

  @OneToMany(type => FilmReview, filmReview => filmReview.user) 
    filmReviews!: FilmReview[];  
    
  public constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }
  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }
}
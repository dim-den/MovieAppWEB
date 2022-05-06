import { Entity, Column,ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Film } from './film';
import { User } from './user';

@Entity({ name: 'filmReview' })
export class FilmReview extends BaseEntity {

  @Column('varchar',  {length: 2048})
  review!: string;

  @Column('int')
  score!: number;

  @Column('datetime')
  published!: Date;

  @Column('int') 
  userId!: number; 

  @ManyToOne(type => User, user => user.filmReviews) 
  user!: User; 

  @Column('int') 
  filmId!: number; 

  @ManyToOne(type => Film, film => film.filmReviews) 
  film!: Film; 

}
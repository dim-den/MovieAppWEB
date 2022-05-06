import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { FilmCast } from './filmCast';
import { FilmReview } from './filmReview';

@Entity({ name: 'film' })
export class Film extends BaseEntity {

  @Column('varchar')
  title!: string;

  @Column('varchar',  {length: 1024})
  description!: string;

  @Column('varchar')
  genre!: string;

  @Column('varchar')
  director!: string;

  @Column('varchar')
  country!: string;

  @Column('datetime')
  release!: Date;

  @Column('int')
  budget!: number;

  @Column('int')
  fees!: number;

  @OneToMany(type => FilmReview, filmReview => filmReview.film) 
  filmReviews!: FilmReview[];  

  @OneToMany(type => FilmCast, filmCast => filmCast.film) 
  filmCasts!: FilmCast[];  
}
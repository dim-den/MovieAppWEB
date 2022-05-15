import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { FilmCast } from './filmCast';

@Entity({ name: 'actor' })
export class Actor extends BaseEntity {

  @Column('varchar')
  name!: string;

  @Column('varchar')
  surname!: string;

  @Column('date')
  birthday!: Date;

  @Column('varchar')
  country!: string;

  @Column({ nullable: true, type: 'varchar' })
  imageUrl!: string;

  @OneToMany(type => FilmCast, filmCast => filmCast.actor) 
  filmCasts!: FilmCast[];  
}
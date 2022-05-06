import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Film } from './film';
import { Actor } from './actor';

@Entity({ name: 'filmCast' })
export class FilmCast extends BaseEntity {
  @Column('varchar')
  roleName!: string;

  @Column('int') 
  filmId!: number; 

  @ManyToOne(type => Film, film => film.filmCasts) 
  film!: Film; 

  @Column('int') 
  actorId!: number; 

  @ManyToOne(type => Actor, actor => actor.filmCasts) 
  actor!: Actor; 
}
import { EntityRepository, Repository } from 'typeorm';
import { Film } from '../models/film';

@EntityRepository(Film)
export class FilmRepository extends Repository<Film> {
  findByTitle(title: string) {
    return this.findOne({ title });
  }
}
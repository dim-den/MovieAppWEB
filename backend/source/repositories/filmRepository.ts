import { EntityRepository, Repository, Like } from 'typeorm';
import { Film } from '../models/film';

@EntityRepository(Film)
export class FilmRepository extends Repository<Film> {
  findByTitleContainingTop5(title: string) {
    return this.find({
    where: {
      title: Like(`%${title}%`)
    },
    take: 5
  });
  }
}
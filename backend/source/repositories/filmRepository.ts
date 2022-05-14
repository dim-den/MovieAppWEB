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

  async updateFilmPoster(filmId: number, posterUrl: string) {
    return this.manager
    .createQueryBuilder()
    .update(Film)
    .set({
        posterUrl: posterUrl
    })
    .where("id = :id", { id: filmId })
    .execute()
  }
}
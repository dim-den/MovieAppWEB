import { EntityRepository, Repository } from 'typeorm';
import { FilmCast } from '../models/filmCast';

@EntityRepository(FilmCast)
export class FilmCastRepository extends Repository<FilmCast> {
    getFilmCastsByFilmId(filmId: number) {
        return this.createQueryBuilder("filmCast")
        .leftJoinAndSelect("filmCast.actor", "actor")
        .where("filmCast.filmId = :filmId", {filmId: filmId})
        .select(["filmCast.id AS id", "filmCast.roleName AS roleName", "filmCast.actorId as actorId", 
                    "filmCast.filmId as filmId", "name AS name", "surname as surname", "birthday as birthday", "imageUrl"])
        .execute();
      }
}
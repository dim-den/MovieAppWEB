import { EntityRepository, Repository } from 'typeorm';
import { FilmReview } from '../models/filmReview';

@EntityRepository(FilmReview)
export class FilmReviewRepository extends Repository<FilmReview> {
  async getFilmAvgScore(filmId: number) {
    return this.manager
    .createQueryBuilder()
    .select("AVG(score)", "score")
    .from(FilmReview, "filmReview")
    .where("filmId = :filmId", { filmId })
    .getRawOne();
  }

  async getUserFilmAvgScore(userId: number) {
    return this.manager
    .createQueryBuilder()
    .select("AVG(score)", "score")
    .from(FilmReview, "filmReview")
    .where("userId = :userId", { userId })
    .getRawOne();
  }

  async updateFilmReview(filmReview: FilmReview) {
    return this.manager
    .createQueryBuilder()
    .update(FilmReview)
    .set({
        score: filmReview.score,
        review: filmReview.review
    })
    .where("id = :id", { id: filmReview.id })
    .execute()
  }

  getFilmReviewsByFilmId(filmId: number) {
    return this.createQueryBuilder("filmReview")
    .leftJoinAndSelect("filmReview.user", "user")
    .where("filmReview.filmId = :filmId", {filmId: filmId})
    .select(["filmReview.id AS id", "filmReview.review AS review", "filmReview.score as score", "filmReview.published as published",
            "filmReview.userId as userId", "filmReview.filmId as filmId", "name AS username", "email", "imageUrl"])
    .execute();
  }
}
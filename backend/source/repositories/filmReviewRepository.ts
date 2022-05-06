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
}
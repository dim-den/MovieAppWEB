import { getCustomRepository } from 'typeorm';
import { AppError, HttpError } from '../util/errors';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { FilmReviewRepository } from '../repositories/filmReviewRepository';
import { FilmReview } from '../models/filmReview';

export class FilmReviewService {

    private filmReviewRepository: FilmReviewRepository;
    public constructor() {
      this.filmReviewRepository = getCustomRepository(FilmReviewRepository);
    }
  
    async leaveFilmReview(filmReview: FilmReview) {
      const existingFilmReview = await this.filmReviewRepository.findOne({filmId: filmReview.filmId, userId: filmReview.userId});

      if(!existingFilmReview) return await this.filmReviewRepository.save(filmReview);
      else {
        filmReview.review = filmReview.review || existingFilmReview.review;
        filmReview.id = existingFilmReview.id;
        return await this.filmReviewRepository.updateFilmReview(filmReview);
      }
    }

    async getFilmReview(filmReviewId: number) {
      const filmReview = await this.filmReviewRepository.findOne({id: filmReviewId});
      if (filmReview) return filmReview;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film review not found');
    }  

    async getFilmReviewsByFilmId(filmId: number) {
      const filmReview = await this.filmReviewRepository.find({filmId});
      if (filmReview) return filmReview;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film reviews not found');
    }  
  
  
    async deleteFilmReview(filmReviewId: number) {
        const filmReview = await this.filmReviewRepository.findOne({id: filmReviewId});
        if (!filmReview) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film review not found');
        else {
          try {
            await this.filmReviewRepository.delete(filmReviewId);
          } catch (err) {
            throw new AppError('Failed to delete film review');
          }
        }
    }

    async getFilmAvgScore(FilmId: number) {
        return await this.filmReviewRepository.getFilmAvgScore(FilmId);
    } 
}
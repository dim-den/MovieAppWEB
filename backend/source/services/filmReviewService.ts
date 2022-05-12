import { getCustomRepository } from 'typeorm';
import { AppError, HttpError } from '../util/errors';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { FilmReviewRepository } from '../repositories/filmReviewRepository';
import { FilmReview } from '../models/filmReview';
import { UserRepository } from '../repositories/userRepository';

export class FilmReviewService {
    private filmReviewRepository: FilmReviewRepository;
    private userRepository: UserRepository;

    public constructor() {
      this.filmReviewRepository = getCustomRepository(FilmReviewRepository);
      this.userRepository = getCustomRepository(UserRepository);
    }    
  
    async leaveFilmReview(token:string, filmReview: FilmReview) {
      let user = await this.userRepository.findByToken(token);
      const existingFilmReview = await this.filmReviewRepository.findOne({filmId: filmReview.filmId, userId: user?.id});

      if(!existingFilmReview)  {
        filmReview.userId = user!.id;
        return await this.filmReviewRepository.save(filmReview);
      }
      else {
        filmReview.review = filmReview.review || existingFilmReview.review;
        filmReview.id = existingFilmReview.id;
        return await this.filmReviewRepository.updateFilmReview(filmReview);
      }
    }

    async saveFilmReview(filmReview: FilmReview) {
      return await this.filmReviewRepository.save(filmReview);
   }

    async getFilmReview(filmReviewId: number) {
      const filmReview = await this.filmReviewRepository.findOne({id: filmReviewId});
      if (filmReview) return filmReview;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film review not found');
    }  

    async getFilmReviews() {
      return await this.filmReviewRepository.find();
    }

    async updateFilmReview(filmReviewId: number, filmReview: FilmReview) {
      const existingFilmReview= await this.filmReviewRepository.findOne({ id: filmReviewId });
      if (!existingFilmReview) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film review not found');
      else {
          try {
              filmReview.id = filmReviewId;
              filmReview.filmId = filmReview.filmId || existingFilmReview.filmId;
              filmReview.userId = filmReview.userId || existingFilmReview.userId;
              filmReview.review = filmReview.review || existingFilmReview.review;
              filmReview.score = filmReview.score || existingFilmReview.score;
              filmReview.published = filmReview.published || existingFilmReview.published;
              await this.filmReviewRepository.save(filmReview);
          } catch (err) {
              throw new AppError('Failed to update film review');
          }
      }
    }

    async getFilmReviewsByFilmId(filmId: number) {
      //const filmReview = await this.filmReviewRepository.find({filmId});
      const filmReview = await this.filmReviewRepository.getFilmReviewsByFilmId(filmId);
      if (filmReview) return filmReview;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film reviews not found');
    }  

    async getFilmReviewsByUserId(userId: number) {
      const filmReview = await this.filmReviewRepository.find({userId});
      if (filmReview) return filmReview;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film reviews not found');
    }  

    async getFilmReviewsByUserIdAndFilmId(userId: number, filmId: number) {
      const filmReview = await this.filmReviewRepository.findOne({userId, filmId});
      if (filmReview) return filmReview;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film review not found');
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

      async getUserFilmAvgScore(FilmId: number) {
        return await this.filmReviewRepository.getUserFilmAvgScore(FilmId);
    } 
}
import { getCustomRepository } from 'typeorm';
import { AppError, HttpError } from '../util/errors';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { FilmCastRepository } from '../repositories/filmCastRepository';
import { FilmCast } from '../models/filmCast';

export class FilmCastService {

    private filmCastRepository: FilmCastRepository;
    public constructor() {
      this.filmCastRepository = getCustomRepository(FilmCastRepository);
    }
  
    async saveFilmCast(filmCast: FilmCast) {
       return await this.filmCastRepository.save(filmCast);
    }

    async getFilmCast(filmCastId: number) {
      const filmCast = await this.filmCastRepository.findOne({id: filmCastId});
      if (filmCast) return filmCast;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film cast not found');
    }  

    async getFilmCastsByFilmId(filmId: number) {
      const filmCast = await this.filmCastRepository.find({filmId});
      if (filmCast) return filmCast;
      else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film casts not found');
    }  
  
  
    async deleteFilmCast(filmCastId: number) {
        const filmCast = await this.filmCastRepository.findOne({id: filmCastId});
        if (!filmCast) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film cast not found');
        else {
          try {
            await this.filmCastRepository.delete(filmCastId);
          } catch (err) {
            throw new AppError('Failed to delete film cast');
          }
        }
    }
}
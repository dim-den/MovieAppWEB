import { getCustomRepository } from 'typeorm';
import { Film } from '../models/film';
import { FilmRepository } from '../repositories/filmRepository';
import { AppError, HttpError } from '../util/errors';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';

export class FilmService {

  private filmRepository: FilmRepository;
  public constructor() {
    this.filmRepository = getCustomRepository(FilmRepository);
  }

  async saveFilm(film: Film) {
    return await this.filmRepository.save(film);
  }

  async getFilm(filmId: number) {
    const film = await this.filmRepository.findOne({ id: filmId });
    if (film) return film;
    else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film not found');
  }

  async deleteFilm(filmId: number) {
    const film = await this.filmRepository.findOne({ id: filmId });
    if (!film) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film not found');
    else {
      try {
        await this.filmRepository.delete(filmId);
      } catch (err) {
        throw new AppError('Failed to delete this film');
      }
    }
  }
}
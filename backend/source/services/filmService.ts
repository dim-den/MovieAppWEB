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

  async getFilms() {
    return await this.filmRepository.find();
  }

  async updateFilm(filmId: number, film: Film) {
    const existingFilm = await this.filmRepository.findOne({ id: filmId });
    if (!existingFilm) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Film not found');
    else {
        try {
            film.id = filmId;
            film.title = film.title || existingFilm.title;
            film.description = film.description || existingFilm.description;
            film.director = film.director || existingFilm.director;
            film.country = film.country || existingFilm.country;
            film.genre = film.genre || existingFilm.genre;
            film.release = film.release || existingFilm.release;
            film.budget = film.budget || existingFilm.budget;
            film.fees = film.fees || existingFilm.fees;
            await this.filmRepository.save(film);
        } catch (err) {
            throw new AppError('Failed to delete actor');
        }
    }
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
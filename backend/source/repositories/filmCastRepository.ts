import { EntityRepository, Repository } from 'typeorm';
import { FilmCast } from '../models/filmCast';

@EntityRepository(FilmCast)
export class FilmCastRepository extends Repository<FilmCast> {

}
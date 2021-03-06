import { ConnectionOptions } from 'typeorm';
import { User } from '../models/user';
import { Film } from '../models/film';

import dotenv from 'dotenv';
import { FilmReview } from '../models/filmReview';
import { FilmCast } from '../models/filmCast';
import { Actor } from '../models/actor';
dotenv.config();

export const DbConfig: ConnectionOptions = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Film, FilmReview, FilmCast, Actor],
};
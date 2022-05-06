import { EntityRepository, Repository } from 'typeorm';
import { Actor } from '../models/actor';

@EntityRepository(Actor)
export class ActorRepository extends Repository<Actor> {

  
}
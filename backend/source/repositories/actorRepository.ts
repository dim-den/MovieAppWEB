import { EntityRepository, Like, Repository } from 'typeorm';
import { Actor } from '../models/actor';

@EntityRepository(Actor)
export class ActorRepository extends Repository<Actor> {

    findBySurnameContainingTop5(surname: string) {
        return this.find({
        where: {
            surname: Like(`%${surname}%`)
        },
        take: 5
      });
      }
}
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

    async updateActorImage(actorId: number, imageUrl: string) {
        return this.manager
            .createQueryBuilder()
            .update(Actor)
            .set({
                imageUrl: imageUrl
            })
            .where("id = :id", { id: actorId })
            .execute()
    }
}
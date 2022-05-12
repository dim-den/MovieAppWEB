import { getCustomRepository } from 'typeorm';
import { AppError, HttpError } from '../util/errors';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { ActorRepository } from '../repositories/actorRepository';
import { Actor } from '../models/actor';

export class ActorService {

    private actorRepository: ActorRepository;
    public constructor() {
        this.actorRepository = getCustomRepository(ActorRepository);
    }

    async saveActor(actor: Actor) {
        return await this.actorRepository.save(actor);
    }

    async getActor(actorId: number) {
        const actor = await this.actorRepository.findOne({ id: actorId });
        if (actor) return actor;
        else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Actor not found');
    }

    async getActors() {
        return await this.actorRepository.find();
    }

    async getActorsBySurnameContainingTop5(surname: string) {
        return await this.actorRepository.findBySurnameContainingTop5(surname);
      }

    async updateActor(actorId: number, actor: Actor) {
        const existingActor = await this.actorRepository.findOne({ id: actorId });
        if (!existingActor) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Actor not found');
        else {
            try {
                actor.id = actorId;
                actor.name = actor.name || existingActor.name;
                actor.surname = actor.surname || existingActor.surname;
                actor.country = actor.country || existingActor.country;
                actor.birthday = actor.birthday || existingActor.birthday;
                await this.actorRepository.save(actor);
            } catch (err) {
                throw new AppError('Failed to delete actor');
            }
        }
    }

    async deleteActor(actorId: number) {
        const actor = await this.actorRepository.findOne({ id: actorId });
        if (!actor) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Actor not found');
        else {
            try {
                await this.actorRepository.delete(actorId);
            } catch (err) {
                throw new AppError('Failed to delete actor');
            }
        }
    }
}
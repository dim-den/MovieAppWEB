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
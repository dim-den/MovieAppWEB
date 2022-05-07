import { getCustomRepository } from 'typeorm';
import { User } from '../models/user';
import { UserRepository } from '../repositories/userRepository';
import { AppError, HttpError } from '../util/errors';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { UserRole } from '../constants/userRole';
import bcrypt from 'bcryptjs';

export class UserService {

  private userRepository: UserRepository;
  public constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  async getUser(userId: number) {
    const info = await this.userRepository.findById(userId);
    if (info) return info;
    else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'User profile not found');
  }

  async setNewName(token: string, newname: string) {
    const userService = new UserService();
    let user = await this.userRepository.findByToken(token);
    if (!user) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Cant find user by provided token');
    await this.userRepository.updateName(user.id, newname);
  }

  async setNewBirthday(token: string, newBD: string) {
    let user = await this.userRepository.findByToken(token);
    if (!user) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Cant find user by provided token');
    await this.userRepository.updateBirthday(user.id, newBD);
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'User not found');
    if (user.role == UserRole.ADMIN) throw new HttpError(httpErrorStatusCodes.FORBIDDEN, "You can't delete admin user");
    else {
      try {
        await this.userRepository.delete(userId);
      } catch (err) {
        throw new AppError('Failed to delete this user');
      }
    }
  }
}
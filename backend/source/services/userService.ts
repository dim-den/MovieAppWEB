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

  async getUser(token: string, userId: number) {
    const userByToken = await this.userRepository.findByToken(token);
    const info = await this.userRepository.findById(userId);

    if(userByToken?.role != UserRole.ADMIN && userByToken!.id != userId) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Not enough rights');
    else if (info) return info;
    else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'User profile not found');
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUserByToken(token: string) {
    const info = await this.userRepository.findByToken(token);
    if (info) return info;
    else throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'User not found');
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

  async updateUser(userId: number, user: User) {
    const existingUser= await this.userRepository.findOne({ id: userId });
    if (!existingUser) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'User not found');
    else {
        try {
            user.id = userId;
            user.name = user.name || existingUser.name;
            user.email = user.email || existingUser.email;
            if(user.password !== existingUser.password) user.password = await bcrypt.hash(user.password , 10);
            user.role = user.role || existingUser.role;
            user.imageUrl = user.imageUrl || existingUser.imageUrl;
            user.birthday = user.birthday || existingUser.birthday;
            user.token = user.token || existingUser.token;
            await this.userRepository.save(user);
        } catch (err) {
            throw new AppError('Failed to update user');
        }
    }
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
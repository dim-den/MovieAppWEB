import { getCustomRepository } from 'typeorm';
import { User } from '../models/user';
import { UserRepository } from '../repositories/userRepository';
import { AppError, HttpError } from '../util/errors';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { UserRole } from '../constants/userRole';
import { jwtConfig } from '../config/jwtConfig';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
  
  private userRepository: UserRepository;

  public constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  private async isEmailTaken(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user == undefined) return false;
    else return true;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async passwordsMatch(providedPass: string, candidatePass: string): Promise<boolean> {
    return await bcrypt.compare(providedPass, candidatePass);
  }

  async setFreshToken(oldToken: string) {
    const user = await this.userRepository.findByToken(oldToken);
    console.log(user);
    if (user != undefined) {
      const newToken = jwt.sign(
        {
          email: user.email,
          userId: user.id,
        },
        jwtConfig.secret!,
        {expiresIn: 24 * 60 * 60}
      );
      await this.userRepository.setNewToken(user.id, newToken);
      return newToken;
    } else throw new AppError("Can't find user by provided token");
  }

  async getUserRole(token: string) {
    const user = await this.userRepository.findByToken(token);
    if (user != undefined) return user.role;
    else throw new AppError("Can't find user by provided token");
  }

  private async saveLoginToken(userId: number, token: string) {
    await this.userRepository.setNewToken(userId, token);
  }

  async registerUser(name: string, email: string, password: string) {
    if (await this.isEmailTaken(email)) throw new HttpError(httpErrorStatusCodes.CONFLICT, 'Email is already taken');
    let candidate: User = new User(name, email);
    await candidate.hashPassword(password);
    candidate.role = UserRole.USER;
    return await this.userRepository.save(candidate);
  }
  
  async setNewPassword(token: string, oldPass: string, newPass: string, newPassConfirm: string) {
    if (newPass !== newPassConfirm) throw new HttpError(httpErrorStatusCodes.FORBIDDEN, "New passwords don't match");

    let user = await this.userRepository.findByToken(token);
    if (!user) throw new HttpError(httpErrorStatusCodes.NOT_FOUND, 'Cant find user by provided token');
    if (!(await this.passwordsMatch(oldPass, user.password)))
      throw new HttpError(httpErrorStatusCodes.FORBIDDEN, "Passwords don't match");
    await user.hashPassword(newPass);
    await this.userRepository.updatePassword(user.id, user.password);
  }

  async loginUser(providedEmail: string, providedPass: string) {
    const candidate = await this.findUserByEmail(providedEmail);
    if (candidate) {
      if (await this.passwordsMatch(providedPass, candidate.password)) {
        const token = jwt.sign(
          {
            email: candidate.email,
            userId: candidate.id,
          },
          jwtConfig.secret!,
          {expiresIn: 24 * 60 * 60}
        );
        await this.saveLoginToken(candidate.id, token);
        return {token: token, email: candidate.email, role: candidate.role};
      } else throw new HttpError(httpErrorStatusCodes.UNAUTHORIZED, 'Wrong email or password');
    } else throw new HttpError(httpErrorStatusCodes.UNAUTHORIZED, "Wrong email or password");
  }

}
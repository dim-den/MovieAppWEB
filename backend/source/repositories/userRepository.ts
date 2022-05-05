import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private alias: string;

  public constructor() {
    super();
    this.alias = 'user';
  }

  findByToken(token: string) {
    return this.findOne({ token });
  }

  findByEmail(email: string) {
    return this.findOne({ email });
  }

  setNewToken(userId: number, newToken: string) {
    return this.createQueryBuilder(this.alias)
      .update(User)
      .set({ token: newToken })
      .where('id = :id', { id: userId })
      .execute();
  }

  async findById(userId: number) {
    return await this.findOne({id:userId})
  }

  async getProfileInfo(userId: number) {
    return await this.manager
      .createQueryBuilder()
      .select(['user.id', 'user.avatar', 'user.name', 'user.email', 'user.birthday'])
      .from(User, this.alias)
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async updatePassword(userId: number, newPass: string) {
    return await this.manager
      .createQueryBuilder()
      .update(User)
      .set({ password: newPass })
      .where('id = :id', { id: userId })
      .execute();
  }

  async updateName(userId: number, newName: string) {
    return await this.manager
      .createQueryBuilder()
      .update(User)
      .set({ name: newName })
      .where('id = :id', { id: userId })
      .execute();
  }

  async updateBirthday(userId: number, newBD: string) {
    //format yyyy-mm-dd
    return await this.manager
      .createQueryBuilder()
      .update(User)
      .set({ birthday: newBD })
      .where('id = :id', { id: userId })
      .execute();
  }
 
}
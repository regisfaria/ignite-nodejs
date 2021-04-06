import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne(user_id);

    if (!user) {
      throw new Error('No user found with that ID');
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const usersOrdered = await this.repository.query(
      'SELECT * FROM users ORDER BY first_name',
    );

    return usersOrdered;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository.query(
      `SELECT DISTINCT * FROM users WHERE UPPER(first_name) LIKE '%${first_name.toUpperCase()}%' AND UPPER(last_name) LIKE '%${last_name.toUpperCase()}%'`,
    );

    return user;
  }
}

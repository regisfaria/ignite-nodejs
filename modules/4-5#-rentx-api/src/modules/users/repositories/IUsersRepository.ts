import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../entities/User';

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  update(user: User): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(email: string): Promise<User>;
}

export { IUsersRepository };
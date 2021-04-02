import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '../../../../config/auth';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error('Email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email or password incorrect');
    }

    const token = sign({}, authConfig.secret, {
      subject: user.id,
      expiresIn: authConfig.expireIn,
    });

    return { user: { name: user.name, email }, token };
  }
}

export { AuthenticateUserUseCase };

import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import { IUsersTokensRepository } from '@modules/users/repositories/IUsersTokensRepository';
import { AppError } from '@shared/errors/AppError';
import getDateAddedByDays from '@shared/utils/getDateAddedByDays';

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
  refreshToken: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const {
      expiresInToken,
      expiresInRefreshToken,
      secretRefreshToken,
      secretToken,
    } = authConfig;
    const expiresInRefreshTokenDays = Number(
      expiresInRefreshToken.split('d')[0],
    );

    if (!user) {
      throw new AppError('Email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect');
    }

    const token = sign({}, secretToken, {
      subject: user.id,
      expiresIn: expiresInToken,
    });

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: user.id,
      expiresIn: expiresInRefreshToken,
    });

    const expiresAt = getDateAddedByDays(expiresInRefreshTokenDays);

    await this.usersTokensRepository.create({
      expires_at: expiresAt,
      user_id: user.id,
      refresh_token: refreshToken,
    });

    return {
      user: {
        name: user.name,
        email,
      },
      token,
      refreshToken,
    };
  }
}

export { AuthenticateUserUseCase };

import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/users/repositories/IUsersTokensRepository';
import { AppError } from '@shared/errors/AppError';
import getDateAddedByDays from '@shared/utils/getDateAddedByDays';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
  ) {}

  async execute(token: string): Promise<string> {
    const { secretRefreshToken, expiresInRefreshToken } = auth;
    const expiresInRefreshTokenDays = Number(
      expiresInRefreshToken.split('d')[0],
    );

    const { sub, email } = verify(token, secretRefreshToken) as IPayload;

    const userId = sub;

    const userToken = await this.usersTokensRepository.findByUserIdAndToken(
      userId,
      token,
    );

    if (!userToken) {
      throw new AppError('Invalid refresh token.');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: sub,
      expiresIn: expiresInRefreshToken,
    });

    const expiresAt = getDateAddedByDays(expiresInRefreshTokenDays);

    await this.usersTokensRepository.create({
      token: refreshToken,
      user_id: userId,
      expires_at: expiresAt,
    });

    return refreshToken;
  }
}

export { RefreshTokenUseCase };

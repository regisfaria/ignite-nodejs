import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, authConfig.secretToken) as IPayload;

    request.user = { id: userId };

    next();
  } catch (invalidToken) {
    try {
      const { sub: userId } = verify(
        token,
        authConfig.secretRefreshToken,
      ) as IPayload;

      request.user = { id: userId };

      next();
    } catch (error) {
      throw new AppError('Invalid Token or Refresh Token', 401);
    }
  }
}

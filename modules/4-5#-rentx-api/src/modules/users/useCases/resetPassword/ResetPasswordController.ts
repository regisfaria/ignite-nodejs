import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUseCase } from './ResetPasswordUseCase';

class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetPassword = container.resolve(ResetPasswordUseCase);

    await resetPassword.execute({ token: token as string, password });

    return response.sendStatus(200);
  }
}

export { ResetPasswordController };

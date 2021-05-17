import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgottenPasswordEmailUseCase } from './SendForgottenPasswordEmailUseCase';

class SendForgottenPasswordEmailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgottenPasswordEmail = container.resolve(
      SendForgottenPasswordEmailUseCase,
    );

    await sendForgottenPasswordEmail.execute(email);

    return response.send();
  }
}

export { SendForgottenPasswordEmailController };

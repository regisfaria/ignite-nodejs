import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendTransferUseCase } from './SendTransferUseCase';

export class SendTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { user_id: beneficiated_id } = request.params;
    const { amount, description } = request.body;

    const sendTransfer = container.resolve(SendTransferUseCase);

    const statement = await sendTransfer.execute({
      user_id,
      beneficiated_id,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}

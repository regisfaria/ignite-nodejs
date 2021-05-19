import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { Statement } from '../../entities/Statement';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { ISendTransferDTO } from './ISendTransferDTO';
import { SendTransferError } from './SendTransferError';

@injectable()
export class SendTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute({
    user_id,
    beneficiated_id,
    amount,
    description,
  }: ISendTransferDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new SendTransferError.UserNotFound();
    }

    const beneficiatedUser = await this.usersRepository.findById(
      beneficiated_id,
    );

    if (!beneficiatedUser) {
      throw new SendTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id,
    });

    if (balance < amount) {
      throw new SendTransferError.InsufficientFunds();
    }

    const statementOperation = await this.statementsRepository.create({
      user_id: beneficiated_id,
      sender_id: user_id,
      amount,
      type: 'transfer' as OperationType,
      description,
    });

    await this.statementsRepository.create({
      user_id,
      amount,
      type: 'withdraw',
      description: `Transference to user: ${beneficiatedUser.name}`,
    });

    return statementOperation;
  }
}

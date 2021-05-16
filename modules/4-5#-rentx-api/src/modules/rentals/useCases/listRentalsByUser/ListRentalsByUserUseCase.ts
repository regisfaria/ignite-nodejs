import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ListRentalsByUserUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(user_id: string): Promise<Rental[]> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('No user was found with given ID');
    }

    const userRentals = await this.rentalsRepository.findAllByUser(user_id);

    return userRentals;
  }
}

export { ListRentalsByUserUseCase };

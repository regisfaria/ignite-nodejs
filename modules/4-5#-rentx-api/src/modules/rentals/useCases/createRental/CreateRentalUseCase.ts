import { injectable, inject } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import getDifferenceInHoursBetweenDates from '@shared/utils/getDifferenceInHoursBetweenDates';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

const minimumRentalHours = 24;

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('There is no user with given ID.');
    }

    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) {
      throw new AppError('No card registred with given ID.');
    }

    const chosenCarUnavailable = await this.rentalsRepository.findOpenRentalByCarId(
      car_id,
    );

    if (chosenCarUnavailable) {
      throw new AppError('This car is already rented.');
    }

    const userHaveOpenRent = await this.rentalsRepository.findOpenRentalByUserId(
      user_id,
    );

    if (userHaveOpenRent) {
      throw new AppError('There is already an open rental for this user.');
    }

    const differenceInHours = getDifferenceInHoursBetweenDates({
      date: expected_return_date,
    });

    if (differenceInHours < minimumRentalHours) {
      throw new AppError(`The minimum rental hours is ${minimumRentalHours}.`);
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };

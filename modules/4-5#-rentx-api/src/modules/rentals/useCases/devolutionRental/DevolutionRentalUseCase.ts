import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';
import getDifferenceInDaysBetweenDates from '@shared/utils/getDifferenceInDaysBetweenDates';

interface IRequest {
  id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    const minimumRentalDays = Number(process.env.MINIMUM_RENTAL_DAYS);
    const car = await this.carsRepository.findById(rental.car_id);

    if (!rental) {
      throw new AppError('Rental with given ID does not exists.');
    }

    let rentedDays = getDifferenceInDaysBetweenDates({
      date: rental.start_date,
    });

    if (rentedDays <= 0) {
      rentedDays = minimumRentalDays;
    }

    const delay = getDifferenceInDaysBetweenDates({
      date: rental.expected_return_date,
    });

    let total = 0;

    if (delay > 0) {
      const fine = delay * car.fine_amount;
      total += fine;
    }

    total += rentedDays * car.daily_rate;

    rental.end_date = dayjs().toDate();
    rental.total = total;

    car.available = true;

    await this.rentalsRepository.update(rental);
    await this.carsRepository.update(car);

    return rental;
  }
}

export { DevolutionRentalUseCase };

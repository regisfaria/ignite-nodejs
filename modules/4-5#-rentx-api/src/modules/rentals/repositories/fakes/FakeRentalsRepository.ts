import { v4 as uuid } from 'uuid';

import { CreateRentalDTO } from '@modules/rentals/dtos/CreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

class FakeRentalsRepository implements IRentalsRepository {
  rentals: Rental[] = [];

  async create(data: CreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(
      rental,
      {
        id: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        start_date: new Date(),
      },
      data,
    );

    this.rentals.push(rental);

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const openRental = this.rentals.find(
      rental => rental.car_id === car_id && !rental.end_date,
    );

    return openRental;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const openRental = this.rentals.find(
      rental => rental.user_id === user_id && !rental.end_date,
    );

    return openRental;
  }
}

export { FakeRentalsRepository };

import { getRepository, Repository } from 'typeorm';

import { CreateRentalDTO } from '@modules/rentals/dtos/CreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create(data: CreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create(data);

    await this.repository.save(rental);

    return rental;
  }

  async update(rental: Rental): Promise<void> {
    await this.repository.save(rental);
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const openRental = await this.repository.findOne({
      where: { car_id, end_date: null },
    });

    return openRental;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const openRental = await this.repository.findOne({
      where: { user_id, end_date: null },
    });

    return openRental;
  }

  async findAllByUser(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ['car'],
    });

    return rentals;
  }
}

export { RentalsRepository };

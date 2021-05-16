import { CreateRentalDTO } from '../dtos/CreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

interface IRentalsRepository {
  create(data: CreateRentalDTO): Promise<Rental>;
  update(rental: Rental): Promise<void>;
  findById(id: string): Promise<Rental>;
  findOpenRentalByCarId(car_id: string): Promise<Rental>;
  findOpenRentalByUserId(user_id: string): Promise<Rental>;
  findAllByUser(user_id: string): Promise<Rental[]>;
}

export { IRentalsRepository };

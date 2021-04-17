import { v4 as uuid } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class FakeCarsRepository implements ICarsRepository {
  cars: Car[] = [];

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(
      car,
      { id: uuid(), available: true, created_at: new Date() },
      data,
    );

    this.cars.push(car);

    return car;
  }

  async update(car: Car): Promise<void> {
    const carIndex = this.cars.findIndex(carToFind => carToFind.id === car.id);

    this.cars[carIndex] = car;
  }

  async findById(id: string): Promise<Car> {
    const car = this.cars.find(carToFind => carToFind.id === id);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.cars.find(
      carToFind => carToFind.license_plate === license_plate,
    );

    return car;
  }

  async findAllAvailable(
    category_id?: string,
    brand?: string,
    name?: string,
  ): Promise<Car[]> {
    if (category_id || brand || name) {
      const filtredCards = this.cars.filter(car => {
        if (
          car.available &&
          ((brand && car.brand === brand) ||
            (name && car.name === name) ||
            (category_id && car.category_id === category_id))
        ) {
          return car;
        }
        return null;
      });

      return filtredCards;
    }

    const availableCars = this.cars.filter(car => car.available);

    return availableCars;
  }
}

export { FakeCarsRepository };

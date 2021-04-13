import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';
import { FakeCategoriesRepository } from '@modules/cars/repositories/fakes/FakeCategoriesRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let fakeCarsRepository: FakeCarsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;

describe('Create Car', () => {
  beforeEach(() => {
    fakeCarsRepository = new FakeCarsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();

    createCarUseCase = new CreateCarUseCase(
      fakeCarsRepository,
      fakeCategoriesRepository,
    );
  });

  it('should be able to create a new Car', async () => {
    const category = await fakeCategoriesRepository.create({
      name: 'category example',
      description: "it's a category example",
    });

    const car = await createCarUseCase.execute({
      name: 'Car example',
      description: "It's an example car",
      daily_rate: 1,
      license_plate: 'EXP001',
      fine_amount: 100,
      brand: 'Example',
      category_id: category.id,
    });

    expect(car).toHaveProperty('id');
  });

  it('should be able to create a new Car with available true by default', async () => {
    const category = await fakeCategoriesRepository.create({
      name: 'category example',
      description: "it's a category example",
    });

    const car = await createCarUseCase.execute({
      name: 'Car example',
      description: "It's an example car",
      daily_rate: 1,
      license_plate: 'EXP001',
      fine_amount: 100,
      brand: 'Example',
      category_id: category.id,
    });

    expect(car.available).toBe(true);
  });

  it('should not be able to create a new Car with a non-existent category', async () => {
    await expect(
      createCarUseCase.execute({
        name: 'Car example',
        description: "It's an example car",
        daily_rate: 1,
        license_plate: 'EXP001',
        fine_amount: 100,
        brand: 'Example',
        category_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new Car with an existent car license plate', async () => {
    const category = await fakeCategoriesRepository.create({
      name: 'category example',
      description: "it's a category example",
    });

    await createCarUseCase.execute({
      name: 'Car example',
      description: "It's an example car",
      daily_rate: 1,
      license_plate: 'EXP001',
      fine_amount: 100,
      brand: 'Example',
      category_id: category.id,
    });

    await expect(
      createCarUseCase.execute({
        name: 'Car example',
        description: "It's an example car",
        daily_rate: 1,
        license_plate: 'EXP001',
        fine_amount: 100,
        brand: 'Example',
        category_id: category.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

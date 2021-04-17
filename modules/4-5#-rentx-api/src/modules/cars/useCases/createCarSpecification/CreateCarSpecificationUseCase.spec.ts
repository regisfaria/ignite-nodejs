import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';
import { FakeSpecificationsRepository } from '@modules/cars/repositories/fakes/FakeSpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let fakeCarsRepository: FakeCarsRepository;
let fakeSpecificationsRepository: FakeSpecificationsRepository;

describe('CreateCarSpecificationUseCase', () => {
  beforeEach(() => {
    fakeCarsRepository = new FakeCarsRepository();
    fakeSpecificationsRepository = new FakeSpecificationsRepository();

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      fakeCarsRepository,
      fakeSpecificationsRepository,
    );
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await fakeCarsRepository.create({
      name: 'Example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ferrari',
      category_id: 'be22c9d2-55ec-4581-93ca-bdff6f576ff7',
    });

    const specification = await fakeSpecificationsRepository.create({
      name: 'test',
      description: 'is a test description',
    });

    const specifications_id = [specification.id];

    const specificationCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationCars.specifications).toContain(specification);
  });

  it('should not be able to add a new specification to a non existent car', async () => {
    const car_id = '1234';
    const specifications_id = ['54321'];

    await expect(
      createCarSpecificationUseCase.execute({ car_id, specifications_id }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

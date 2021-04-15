import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let fakeCarsRepostory: FakeCarsRepository;

describe('ListAvailableCars', () => {
  beforeEach(() => {
    fakeCarsRepostory = new FakeCarsRepository();

    listAvailableCarsUseCase = new ListAvailableCarsUseCase(fakeCarsRepostory);
  });

  it('should be able to list all available cars', async () => {
    const expectedCar = await fakeCarsRepostory.create({
      name: 'Example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ferrari',
      category_id: 'be22c9d2-55ec-4581-93ca-bdff6f576ff7',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([expectedCar]);
  });

  it('should be able to list all available cars by name', async () => {
    const expectedCar = await fakeCarsRepostory.create({
      name: 'Example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ferrari',
      category_id: 'be22c9d2-55ec-4581-93ca-bdff6f576ff7',
    });

    await fakeCarsRepostory.create({
      name: 'Another example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ferrari',
      category_id: 'be22c9d2-55ec-4581-93ca-bdff6f576ff7',
    });

    const carsByName = await listAvailableCarsUseCase.execute({
      name: expectedCar.name,
    });

    expect(carsByName).toEqual([expectedCar]);
  });

  it('should be able to list all available cars by brand', async () => {
    const expectedCar = await fakeCarsRepostory.create({
      name: 'Example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ferrari',
      category_id: 'be22c9d2-55ec-4581-93ca-bdff6f576ff7',
    });

    await fakeCarsRepostory.create({
      name: 'Another example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ford',
      category_id: 'be22c9d2-55ec-4581-93ca-bdff6f576ff7',
    });

    const carsByBrand = await listAvailableCarsUseCase.execute({
      brand: expectedCar.brand,
    });

    expect(carsByBrand).toEqual([expectedCar]);
  });

  it('should be able to list all available cars by category', async () => {
    const expectedCar = await fakeCarsRepostory.create({
      name: 'Example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ferrari',
      category_id: 'be22c9d2-55ec-4581-93ca-bdff6f576ff7',
    });

    await fakeCarsRepostory.create({
      name: 'Another example car',
      description: 'Example description',
      daily_rate: 14.0,
      license_plate: 'XUA1122',
      fine_amount: 1000,
      brand: 'Ferrari',
      category_id: 'XXXaaa1-55ec-4581-93ca-bdff6f576ff7',
    });

    const carsByCategory = await listAvailableCarsUseCase.execute({
      category_id: expectedCar.category_id,
    });

    expect(carsByCategory).toEqual([expectedCar]);
  });
});

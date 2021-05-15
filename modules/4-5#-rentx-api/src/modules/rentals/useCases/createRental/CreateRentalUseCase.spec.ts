import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';
import { FakeRentalsRepository } from '@modules/rentals/repositories/fakes/FakeRentalsRepository';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let fakeRentalsRepository: FakeRentalsRepository;
let fakeCarsRepository: FakeCarsRepository;
let fakeUsersRepository: FakeUsersRepository;

const expected_return_date = new Date(
  new Date().setDate(new Date().getDate() + 2),
);

describe('CreateRental', () => {
  beforeEach(() => {
    fakeRentalsRepository = new FakeRentalsRepository();
    fakeCarsRepository = new FakeCarsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createRentalUseCase = new CreateRentalUseCase(
      fakeRentalsRepository,
      fakeCarsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a rental', async () => {
    const user = await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const car = await fakeCarsRepository.create({
      brand: 'Test',
      category_id: 'test-category-id',
      daily_rate: 12.0,
      description: "It's a test car entry",
      fine_amount: 1000.0,
      license_plate: 'TST001',
      name: 'Test Car',
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: user.id,
      expected_return_date,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should be able to set car availability to "false" when a rental is created', async () => {
    const user = await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const car = await fakeCarsRepository.create({
      brand: 'Test',
      category_id: 'test-category-id',
      daily_rate: 12.0,
      description: "It's a test car entry",
      fine_amount: 1000.0,
      license_plate: 'TST001',
      name: 'Test Car',
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: user.id,
      expected_return_date,
    });

    const rentedCar = await fakeCarsRepository.findByLicensePlate('TST001');

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');

    expect(rentedCar.available).toBe(false);
  });

  it('should not be able to create a rental for a non-existing user', async () => {
    const car = await fakeCarsRepository.create({
      brand: 'Test',
      category_id: 'test-category-id',
      daily_rate: 12.0,
      description: "It's a test car entry",
      fine_amount: 1000.0,
      license_plate: 'TST001',
      name: 'Test Car',
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: 'non-existing-user-id',
        expected_return_date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a rental with a non-existing car', async () => {
    const user = await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createRentalUseCase.execute({
        car_id: 'non-existing-car-id',
        user_id: user.id,
        expected_return_date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a rental with a car that is already rented', async () => {
    const user = await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const car = await fakeCarsRepository.create({
      brand: 'Test',
      category_id: 'test-category-id',
      daily_rate: 12.0,
      description: "It's a test car entry",
      fine_amount: 1000.0,
      license_plate: 'TST001',
      name: 'Test Car',
    });

    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: user.id,
      expected_return_date,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        expected_return_date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a rental for a user that is already with an open rental', async () => {
    const user = await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const car1 = await fakeCarsRepository.create({
      brand: 'Test',
      category_id: 'test-category-id',
      daily_rate: 12.0,
      description: "It's a test car entry",
      fine_amount: 1000.0,
      license_plate: 'TST001',
      name: 'Test Car',
    });

    const car2 = await fakeCarsRepository.create({
      brand: 'Test',
      category_id: 'test-category-id',
      daily_rate: 12.0,
      description: "It's a test car entry",
      fine_amount: 1000.0,
      license_plate: 'TST002',
      name: 'Test Car 2',
    });

    await createRentalUseCase.execute({
      car_id: car1.id,
      user_id: user.id,
      expected_return_date,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car2.id,
        user_id: user.id,
        expected_return_date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a rental with the expected return date below the minimum rental hours', async () => {
    const user = await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const car = await fakeCarsRepository.create({
      brand: 'Test',
      category_id: 'test-category-id',
      daily_rate: 12.0,
      description: "It's a test car entry",
      fine_amount: 1000.0,
      license_plate: 'TST001',
      name: 'Test Car',
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        expected_return_date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

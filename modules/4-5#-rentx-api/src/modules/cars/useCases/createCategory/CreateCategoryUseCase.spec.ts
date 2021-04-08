import { AppError } from '@errors/AppError';

import { FakeCategoriesRepository } from '../../repositories/fakes/FakeCategoriesRepository';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let fakeCategoriesRepository: FakeCategoriesRepository;

describe('Create Category', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();

    createCategoryUseCase = new CreateCategoryUseCase(fakeCategoriesRepository);
  });

  it('should be able to create a new Category', async () => {
    const category = {
      name: 'Test Category',
      description: 'Test description',
    };

    await createCategoryUseCase.execute(category);

    const createdCategory = await await fakeCategoriesRepository.findByName(
      category.name,
    );

    expect(createdCategory).toHaveProperty('id');
  });

  it('should not be able to create a new Category with a name that already exists', async () => {
    const category = {
      name: 'Test Category',
      description: 'Test description',
    };

    await createCategoryUseCase.execute(category);

    await expect(
      createCategoryUseCase.execute(category),
    ).rejects.toBeInstanceOf(AppError);
  });
});

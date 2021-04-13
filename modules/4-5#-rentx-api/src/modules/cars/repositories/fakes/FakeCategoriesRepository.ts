import { v4 as uuid } from 'uuid';

import { ICreateCategoryDTO } from '../../dtos/ICreateCategoryDTO';
import { Category } from '../../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../ICategoriesRepository';

class FakeCategoriesRepository implements ICategoriesRepository {
  categories: Category[] = [];

  async findByName(name: string): Promise<Category> {
    const category = this.categories.find(
      categoryToFind => categoryToFind.name === name,
    );

    return category;
  }

  async findById(id: string): Promise<Category> {
    const category = this.categories.find(
      categoryToFind => categoryToFind.id === id,
    );

    return category;
  }

  async list(): Promise<Category[]> {
    const all = this.categories;

    return all;
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<Category> {
    const category = new Category();

    Object.assign(category, {
      id: uuid(),
      name,
      description,
      created_at: new Date(),
    });

    this.categories.push(category);

    return category;
  }
}

export { FakeCategoriesRepository };

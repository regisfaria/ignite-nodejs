import { ICreateSpecificationDTO } from '../dtos/ICreateSpecificationDTO';
import { Specification } from '../entities/Specification';

interface ISpecificationRepository {
  findByName(name: string): Promise<Specification>;
  create({ name, description }: ICreateSpecificationDTO): Promise<void>;
}

export { ISpecificationRepository };

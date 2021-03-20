import { SpecificationRepository } from '../../repositories/implementations/SpecificationRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateSpecificationUseCase {
  constructor(private specificationsRepository: SpecificationRepository) {
    this.specificationsRepository = specificationsRepository;
  }

  execute({ name, description }: IRequest): void {
    const specificationAlreadyExists = this.specificationsRepository.findByName(
      name,
    );

    if (specificationAlreadyExists) {
      throw new Error('Specification already Exists.');
    }

    this.specificationsRepository.create({ name, description });
  }
}

export { CreateSpecificationUseCase };

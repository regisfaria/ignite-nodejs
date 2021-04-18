import { inject, injectable } from 'tsyringe';

import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarImagesRepository } from '@modules/cars/repositories/ICarImagesRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarImagesRepository')
    private carImagesRepository: ICarImagesRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<CarImage[]> {
    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) {
      throw new AppError('No car registred with given ID');
    }

    const imagesUploaded = await Promise.all(
      images_name.map(async image => {
        const uploadedImage = await this.carImagesRepository.create(
          car_id,
          image,
        );

        return uploadedImage;
      }),
    );

    return imagesUploaded;
  }
}

export { UploadCarImagesUseCase };

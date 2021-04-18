import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Car } from './Car';

@Entity('car_images')
class CarImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  car_id: string;

  @ManyToOne(() => Car, car => car.images)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @Column()
  image_name: string;

  @CreateDateColumn()
  created_at: Date;
}

export { CarImage };

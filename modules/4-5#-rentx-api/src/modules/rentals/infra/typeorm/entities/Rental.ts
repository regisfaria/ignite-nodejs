import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';

@Entity('rentals')
class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @Column('uuid')
  car_id: string;

  @Column('uuid')
  user_id: string;

  @CreateDateColumn()
  start_date: Date;

  @Column('date')
  end_date: Date;

  @Column('date')
  expected_return_date: Date;

  @Column('float')
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Rental };

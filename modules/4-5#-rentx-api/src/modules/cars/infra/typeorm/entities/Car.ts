import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from './Category';

@Entity('cars')
class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('float')
  daily_rate: number;

  @Column('boolean')
  available: boolean;

  @Column()
  license_plate: string;

  @Column('float')
  fine_amount: number;

  @Column()
  brand: string;

  @CreateDateColumn()
  created_at: Date;
}

export { Car };

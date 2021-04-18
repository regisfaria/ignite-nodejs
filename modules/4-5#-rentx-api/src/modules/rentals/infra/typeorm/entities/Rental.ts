import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rentals')
class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

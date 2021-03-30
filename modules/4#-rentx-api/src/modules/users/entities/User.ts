import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  driver_license: string;

  @Column()
  email: string;

  @Column('bool')
  admin: boolean;

  @CreateDateColumn()
  created_at: Date;
}

export { User };

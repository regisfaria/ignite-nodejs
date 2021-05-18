import { FakeUsersTokensRepository } from '@modules/users/repositories/fakes/FakeUsersTokensRepository';
import { AppError } from '@shared/errors/AppError';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { FakeUsersRepository } from '../../repositories/fakes/FakeUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);
    fakeUsersTokensRepository = new FakeUsersTokensRepository();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      fakeUsersRepository,
      fakeUsersTokensRepository,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '123123',
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    };

    await createUserUseCase.execute(user);

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(auth).toHaveProperty('token');
  });

  it('should not be able to authenticate an non-existent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'non-existent-email@test.com',
        password: '112344',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong credentials', async () => {
    const user: ICreateUserDTO = {
      driver_license: '123123',
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong-email@test.com',
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

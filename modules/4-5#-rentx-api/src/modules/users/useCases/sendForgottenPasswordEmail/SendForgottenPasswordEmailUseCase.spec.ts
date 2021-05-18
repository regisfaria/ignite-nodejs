import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { FakeUsersTokensRepository } from '@modules/users/repositories/fakes/FakeUsersTokensRepository';
import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { AppError } from '@shared/errors/AppError';

import { SendForgottenPasswordEmailUseCase } from './SendForgottenPasswordEmailUseCase';

let sendForgottenPasswordEmailUseCase: SendForgottenPasswordEmailUseCase;
let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let mailProvider: FakeMailProvider;

describe('Send Forgotten Password Email', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    mailProvider = new FakeMailProvider();

    sendForgottenPasswordEmailUseCase = new SendForgottenPasswordEmailUseCase(
      fakeUsersRepository,
      fakeUsersTokensRepository,
      mailProvider,
    );
  });

  it('should be able to send a forgotten password email to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    await sendForgottenPasswordEmailUseCase.execute('johndoe@email.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should be able to create an user token', async () => {
    const generateTokenForEmail = spyOn(fakeUsersTokensRepository, 'create');

    await fakeUsersRepository.create({
      driver_license: 'TEST-LICENSE',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    await sendForgottenPasswordEmailUseCase.execute('johndoe@email.com');

    expect(generateTokenForEmail).toHaveBeenCalled();
  });

  it('should not be able to send a forgotten password email to user that does not exists', async () => {
    await expect(
      sendForgottenPasswordEmailUseCase.execute('johndoe@email.com'),
    ).rejects.toBeInstanceOf(AppError);
  });
});

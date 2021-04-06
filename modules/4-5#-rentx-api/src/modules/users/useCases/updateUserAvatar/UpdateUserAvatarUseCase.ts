import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { deleteFile } from '../../../../utils/file';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  userId: string;
  avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersReposity: IUsersRepository,
  ) {}

  async execute({ userId, avatarFile }: IRequest): Promise<void> {
    const user = await this.usersReposity.findById(userId);

    if (!user) {
      throw new AppError('No user found with that ID');
    }

    if (user.avatar) {
      await deleteFile(`./tmp/avatars/${user.avatar}`);
    }

    user.avatar = avatarFile;

    await this.usersReposity.update(user);
  }
}

export { UpdateUserAvatarUseCase };

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const avatarFile = request.file.filename;
    const { id: userId } = request.user;

    const updateAvatar = container.resolve(UpdateUserAvatarUseCase);

    await updateAvatar.execute({ avatarFile, userId });

    return response.status(200).json();
  }
}

export { UpdateUserAvatarController };

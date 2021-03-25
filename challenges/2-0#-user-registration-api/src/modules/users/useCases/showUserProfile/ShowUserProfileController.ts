import { Request, Response } from "express";
import { User } from "modules/users/model/User";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

class ShowUserProfileController {
  constructor(private showUserProfileUseCase: ShowUserProfileUseCase) {}

  handle(request: Request, response: Response): Response {
    const { user_id } = request.params;

    let profile: User;
    try {
      profile = this.showUserProfileUseCase.execute({ user_id });
    } catch (error) {
      return response.status(404).json({ error });
    }

    return response.status(200).json(profile);
  }
}

export { ShowUserProfileController };

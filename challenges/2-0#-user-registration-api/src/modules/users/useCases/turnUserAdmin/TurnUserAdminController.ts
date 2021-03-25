import { Request, Response } from "express";
import { User } from "modules/users/model/User";

import { TurnUserAdminUseCase } from "./TurnUserAdminUseCase";

class TurnUserAdminController {
  constructor(private turnUserAdminUseCase: TurnUserAdminUseCase) {}

  handle(request: Request, response: Response): Response {
    const { user_id } = request.params;

    let admin: User;
    try {
      admin = this.turnUserAdminUseCase.execute({ user_id });
    } catch (error) {
      return response.status(404).json({ error });
    }

    return response.status(201).json(admin);
  }
}

export { TurnUserAdminController };

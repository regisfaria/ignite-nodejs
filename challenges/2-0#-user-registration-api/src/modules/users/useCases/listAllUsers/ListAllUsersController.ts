import { Request, Response } from "express";
import { User } from "modules/users/model/User";

import { ListAllUsersUseCase } from "./ListAllUsersUseCase";

interface IRequestHeaders {
  user_id?: string;
}

class ListAllUsersController {
  constructor(private listAllUsersUseCase: ListAllUsersUseCase) {}

  handle(request: Request, response: Response): Response {
    const { user_id } = request.headers as IRequestHeaders;

    let users: User[];
    try {
      users = this.listAllUsersUseCase.execute({ user_id });
    } catch (error) {
      console.log("erouuu");
      return response.status(400).json({ error });
    }

    return response.status(200).json(users);
  }
}

export { ListAllUsersController };

import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class ListAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User[] {
    const currentUser = this.usersRepository.findById(user_id);

    if (!currentUser) {
      throw new Error("This ID have no user match");
    }

    if (!currentUser.admin) {
      throw new Error("This user is not an admin");
    }

    const users = this.usersRepository.list();

    return users;
  }
}

export { ListAllUsersUseCase };

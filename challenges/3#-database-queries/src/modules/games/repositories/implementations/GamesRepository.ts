import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';
import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const gamesContainingParam = await this.repository
      .createQueryBuilder('games')
      .select()
      .where('UPPER(games.title) like :matchQuery', {
        matchQuery: `%${param.toUpperCase()}%`,
      })
      .getMany();

    return gamesContainingParam;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const totalGames = await this.repository.query(
      `SELECT COUNT(*) FROM games`,
    );

    return totalGames;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const gamesWithUsers = await this.repository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.users', 'users')
      .where('games.id = :id', { id })
      .getMany();

    return gamesWithUsers[0].users;
  }
}

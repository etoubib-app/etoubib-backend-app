import { User } from '@lib/shared/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(private readonly connection: DataSource) {
    this.userRepository = connection.getRepository(User);
  }
}

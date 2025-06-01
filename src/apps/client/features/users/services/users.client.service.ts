import { ClientUser } from '@lib/shared/entities';
import { Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ClientUsersService {
  private readonly clientUsersRepository: Repository<ClientUser>;

  constructor(private readonly connection: DataSource) {
    this.clientUsersRepository = connection.getRepository(ClientUser);
  }
}

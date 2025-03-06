import { ClientUsers } from '@lib/shared';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CONNECTION } from '../../constants/app.constant';

@Injectable({ scope: Scope.REQUEST })
export class ClientUsersService {
  private readonly clientUsersRepository: Repository<ClientUsers>;

  constructor(@Inject(CONNECTION) connection: DataSource) {
    this.clientUsersRepository = connection.getRepository(ClientUsers);
  }

  findAll() {
    return this.clientUsersRepository.find();
  }

  async findOne(id: string) {
    const result = (await this.clientUsersRepository.query(
      'SELECT * FROM current_schema()',
    )) as unknown;
    console.log('result', result);

    return this.clientUsersRepository.findOne({
      where: { id },
    });
  }
}

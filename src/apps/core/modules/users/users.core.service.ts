import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CoreUsers } from './entities/users.core.entity';
import { CONNECTION } from '../../../../constants/app.constant';

@Injectable({ scope: Scope.REQUEST })
export class CoreUsersService {
  private readonly coreUsersRepository: Repository<CoreUsers>;

  constructor(@Inject(CONNECTION) connection: DataSource) {
    this.coreUsersRepository = connection.getRepository(CoreUsers);
  }

  findAll() {
    return this.coreUsersRepository.find();
  }

  async findOne(id: string) {
    const result = (await this.coreUsersRepository.query(
      'SELECT * FROM current_schema()',
    )) as unknown;
    console.log('result', result);

    return this.coreUsersRepository.findOne({
      where: { id },
    });
  }
}

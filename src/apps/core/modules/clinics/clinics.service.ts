import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CoreClinics } from './entities/clinics.core.entity';
import { CONNECTION } from '../../../../../src/constants/app.constant';

@Injectable({ scope: Scope.REQUEST })
export class CoreClinicsService {
  private readonly coreClinicsRepository: Repository<CoreClinics>;

  constructor(@Inject(CONNECTION) connection: DataSource) {
    this.coreClinicsRepository = connection.getRepository(CoreClinics);
  }

  findAll() {
    return this.coreClinicsRepository.find();
  }

  async findOne(id: number) {
    const result = (await this.coreClinicsRepository.query(
      'SELECT * FROM current_schema()',
    )) as unknown;
    console.log('result', result);

    return this.coreClinicsRepository.findOne({
      where: { id },
    });
  }
}

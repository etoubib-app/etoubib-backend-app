import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Clinic } from '../entities/clinic.entity';

@EventSubscriber()
export class DynamicSchemaSubscriber
  implements EntitySubscriberInterface<Clinic>
{
  constructor(private dataSource: DataSource) {}

  listenTo() {
    return Clinic;
  }

  async afterInsert(event: InsertEvent<Clinic>) {
    const clinic = event.entity;
    await this.createDynamicSchema(clinic.name);
  }

  private async createDynamicSchema(schemaName: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

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
    await this.createDynamicSchema(clinic.key);
  }

  private async createDynamicSchema(schemaName: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create new schema
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

      // Create tables in the new schema
      await queryRunner.query(`
        CREATE TABLE "${schemaName}"."a" (
          id SERIAL PRIMARY KEY
        )
      `);

      await queryRunner.query(`
        CREATE TABLE "${schemaName}"."b" (
          id SERIAL PRIMARY KEY
        )
      `);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

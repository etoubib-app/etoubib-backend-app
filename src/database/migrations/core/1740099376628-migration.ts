import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Migration1740099376585 implements MigrationInterface {
  name = 'Migration1740099376585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `CREATE TABLE "${schema}"."table_two" ("id" SERIAL NOT NULL, CONSTRAINT "PK_dcbd592affb9c080b4ca0d8a055" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."clinics" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(`DROP TABLE "${schema}"."clinics"`);
    await queryRunner.query(`DROP TABLE "${schema}"."table_two"`);
  }
}

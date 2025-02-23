import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1740338162985 implements MigrationInterface {
  name = 'Migration1740338162985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "backoffice"."clinic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_c8daa8ffcad86f9ba63a5c70286" UNIQUE ("name"), CONSTRAINT "PK_8e97c18debc9c7f7606e311d763" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "backoffice"."clinic"`);
  }
}

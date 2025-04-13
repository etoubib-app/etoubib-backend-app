import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1744580946591 implements MigrationInterface {
  name = 'Migration1744580946591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "backoffice"."clinics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenantId" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "activationStatus" character varying NOT NULL DEFAULT 'pending', "migrationStatus" character varying DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_336cf1d4ee6ffabde299a76da18" UNIQUE ("tenantId"), CONSTRAINT "UQ_79dd2d4fc95a707b7248ebbeadb" UNIQUE ("name"), CONSTRAINT "UQ_58953011c57cc9bf5b38182e454" UNIQUE ("email"), CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "backoffice"."clinics"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742393026079 implements MigrationInterface {
  name = 'Migration1742393026079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "backoffice"."clinic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenantId" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "activationStatus" character varying NOT NULL DEFAULT 'pending', "migrationStatus" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ceaaa8ea3b981b3b2f680b3dd84" UNIQUE ("tenantId"), CONSTRAINT "UQ_050033b437380ba808c041fe730" UNIQUE ("email"), CONSTRAINT "PK_8e97c18debc9c7f7606e311d763" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "backoffice"."clinic"`);
  }
}

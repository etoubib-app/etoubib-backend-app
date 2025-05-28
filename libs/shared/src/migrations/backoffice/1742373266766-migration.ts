import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742373266766 implements MigrationInterface {
  name = 'Migration1742373266766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "backoffice"."role_authorizations" ("role_id" uuid NOT NULL, "authorization" character varying NOT NULL, CONSTRAINT "PK_c5866d6d89b686943658e84d5a3" PRIMARY KEY ("role_id", "authorization"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "backoffice"."role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "backoffice"."role_authorizations" ADD CONSTRAINT "FK_0121f7100abe4d16ff04330ae21" FOREIGN KEY ("role_id") REFERENCES "backoffice"."role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "backoffice"."role_authorizations" DROP CONSTRAINT "FK_0121f7100abe4d16ff04330ae21"`,
    );
    await queryRunner.query(`DROP TABLE "backoffice"."role"`);
    await queryRunner.query(`DROP TABLE "backoffice"."role_authorizations"`);
  }
}

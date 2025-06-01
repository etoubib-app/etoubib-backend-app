import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748748801892 implements MigrationInterface {
  name = 'Migration1748748801892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "backoffice"."clinics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "stage" character varying, "stage_error" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2349418f6651f2b72aa6bd4675b" UNIQUE ("tenant_id"), CONSTRAINT "UQ_79dd2d4fc95a707b7248ebbeadb" UNIQUE ("name"), CONSTRAINT "UQ_58953011c57cc9bf5b38182e454" UNIQUE ("email"), CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "backoffice"."role_authorizations" ("role_id" uuid NOT NULL, "authorization" character varying NOT NULL, CONSTRAINT "PK_c5866d6d89b686943658e84d5a3" PRIMARY KEY ("role_id", "authorization"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "backoffice"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "backoffice"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "backoffice"."role_authorizations" ADD CONSTRAINT "FK_0121f7100abe4d16ff04330ae21" FOREIGN KEY ("role_id") REFERENCES "backoffice"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "backoffice"."role_authorizations" DROP CONSTRAINT "FK_0121f7100abe4d16ff04330ae21"`,
    );
    await queryRunner.query(`DROP TABLE "backoffice"."users"`);
    await queryRunner.query(`DROP TABLE "backoffice"."roles"`);
    await queryRunner.query(`DROP TABLE "backoffice"."role_authorizations"`);
    await queryRunner.query(`DROP TABLE "backoffice"."clinics"`);
  }
}

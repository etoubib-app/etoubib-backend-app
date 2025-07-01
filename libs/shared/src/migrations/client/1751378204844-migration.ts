import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Migration1751378204844 implements MigrationInterface {
  name = 'Migration1751378204844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `CREATE TABLE "${schema}"."addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP, "address" character varying(200) NOT NULL, "postalCode" character varying(20) NOT NULL, "city" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, CONSTRAINT "UQ_69b31ba33682e27f43b4754126a" UNIQUE ("address"), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "phone_number" character varying(20) NOT NULL, "cin" character varying(20) NOT NULL, "birth_date" date NOT NULL, "guardian_first_name" character varying(100), "guardian_last_name" character varying(100), "guardian_phone_number" character varying(20), "cnss" character varying(30), "addressId" uuid, "guardianId" uuid, CONSTRAINT "UQ_a0d78441c0c6cf0f1753a1fb139" UNIQUE ("cin"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "created_at" SET DEFAULT 'now()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "updated_at" SET DEFAULT 'now()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."patients" ADD CONSTRAINT "FK_17033e1c4c870cca112873b0dd4" FOREIGN KEY ("addressId") REFERENCES "${schema}"."addresses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."patients" ADD CONSTRAINT "FK_e05f8dd6d25b3dbc4f1e36f2b73" FOREIGN KEY ("guardianId") REFERENCES "${schema}"."patients"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `ALTER TABLE "${schema}"."patients" DROP CONSTRAINT "FK_e05f8dd6d25b3dbc4f1e36f2b73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."patients" DROP CONSTRAINT "FK_17033e1c4c870cca112873b0dd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-29 11:58:21.487302+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-29 11:58:21.487302+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."patients"`);
    await queryRunner.query(`DROP TABLE "${schema}"."addresses"`);
  }
}

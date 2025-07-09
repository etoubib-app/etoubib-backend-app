import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Migration1748755162664 implements MigrationInterface {
  name = 'Migration1748755162664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `CREATE TABLE "${schema}"."role_authorizations" ("role_id" uuid NOT NULL, "authorization" character varying NOT NULL, CONSTRAINT "PK_c5866d6d89b686943658e84d5a3" PRIMARY KEY ("role_id", "authorization"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "parent_id" uuid, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "isOwner" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."role_authorizations" ADD CONSTRAINT "FK_0121f7100abe4d16ff04330ae21" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `ALTER TABLE "${schema}"."role_authorizations" DROP CONSTRAINT "FK_0121f7100abe4d16ff04330ae21"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."users"`);
    await queryRunner.query(`DROP TABLE "${schema}"."roles"`);
    await queryRunner.query(`DROP TABLE "${schema}"."role_authorizations"`);
  }
}

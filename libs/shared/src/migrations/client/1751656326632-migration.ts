import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Migration1751656326632 implements MigrationInterface {
  name = 'Migration1751656326632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `CREATE TABLE "${schema}"."forms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP, "title" character varying NOT NULL, CONSTRAINT "PK_ba062fd30b06814a60756f233da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP, "question" text NOT NULL, "position" integer NOT NULL, "type" character varying NOT NULL, "options_json" json, "formId" uuid, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."form_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP, "answer_json" json, "patientId" uuid, "questionId" uuid, CONSTRAINT "PK_c52f7d73b7cd03332ba47dca123" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1ea5b4370f35fd9c30bc710227" ON "${schema}"."form_answers" ("patientId", "questionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."questions" ADD CONSTRAINT "FK_e635f8de2abc09c58f97c5ce70e" FOREIGN KEY ("formId") REFERENCES "${schema}"."forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."form_answers" ADD CONSTRAINT "FK_367f11fb516ebe659f4f16e7269" FOREIGN KEY ("patientId") REFERENCES "${schema}"."patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."form_answers" ADD CONSTRAINT "FK_62190cf83ebd77895b9bfddfe86" FOREIGN KEY ("questionId") REFERENCES "${schema}"."questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `ALTER TABLE "${schema}"."form_answers" DROP CONSTRAINT "FK_62190cf83ebd77895b9bfddfe86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."form_answers" DROP CONSTRAINT "FK_367f11fb516ebe659f4f16e7269"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."questions" DROP CONSTRAINT "FK_e635f8de2abc09c58f97c5ce70e"`,
    );
    await queryRunner.query(
      `DROP INDEX "${schema}"."IDX_1ea5b4370f35fd9c30bc710227"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."form_answers"`);
    await queryRunner.query(`DROP TABLE "${schema}"."questions"`);
    await queryRunner.query(`DROP TABLE "${schema}"."forms"`);
  }
}

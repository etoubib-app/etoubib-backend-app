import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Migration1752338128803 implements MigrationInterface {
  name = 'Migration1752338128803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `CREATE TABLE "${schema}"."forms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, CONSTRAINT "PK_ba062fd30b06814a60756f233da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "question" text NOT NULL, "position" integer NOT NULL, "type" character varying NOT NULL, "options_json" json, "formId" uuid, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."form_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "answer_json" json, "patientId" uuid, "questionId" uuid, CONSTRAINT "PK_c52f7d73b7cd03332ba47dca123" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1ea5b4370f35fd9c30bc710227" ON "${schema}"."form_answers" ("patientId", "questionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "address" character varying(200) NOT NULL, "postalCode" character varying(20) NOT NULL, "city" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, CONSTRAINT "UQ_69b31ba33682e27f43b4754126a" UNIQUE ("address"), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "phone_number" character varying(20) NOT NULL, "cin" character varying(20) NOT NULL, "birth_date" date NOT NULL, "guardian_first_name" character varying(100), "guardian_last_name" character varying(100), "guardian_phone_number" character varying(20), "cnss" character varying(30), "addressId" uuid, "guardianId" uuid, CONSTRAINT "UQ_a0d78441c0c6cf0f1753a1fb139" UNIQUE ("cin"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "updated_at" SET DEFAULT now()`,
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
      `ALTER TABLE "${schema}"."form_answers" DROP CONSTRAINT "FK_62190cf83ebd77895b9bfddfe86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."form_answers" DROP CONSTRAINT "FK_367f11fb516ebe659f4f16e7269"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."questions" DROP CONSTRAINT "FK_e635f8de2abc09c58f97c5ce70e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "updated_at" SET DEFAULT '2025-07-12 16:35:22.537602+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ALTER COLUMN "created_at" SET DEFAULT '2025-07-12 16:35:22.537602+00'`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."patients"`);
    await queryRunner.query(`DROP TABLE "${schema}"."addresses"`);
    await queryRunner.query(
      `DROP INDEX "${schema}"."IDX_1ea5b4370f35fd9c30bc710227"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."form_answers"`);
    await queryRunner.query(`DROP TABLE "${schema}"."questions"`);
    await queryRunner.query(`DROP TABLE "${schema}"."forms"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742806812480 implements MigrationInterface {
  name = 'Migration1742806812480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "backoffice"."clinic" ADD CONSTRAINT "UQ_c8daa8ffcad86f9ba63a5c70286" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "backoffice"."clinic" DROP CONSTRAINT "UQ_c8daa8ffcad86f9ba63a5c70286"`,
    );
  }
}

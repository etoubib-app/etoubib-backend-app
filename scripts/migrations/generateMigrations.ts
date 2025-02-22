import { DataSource, DataSourceOptions } from 'typeorm';
import { camelCase } from 'typeorm/util/StringUtils';
import * as fs from 'fs';
import * as path from 'path';
import { checkSchemaArg } from './migration.helpers';
import { getSourceSchema } from './migration.helpers';
import { Query } from 'typeorm/driver/Query';
import { SchemaType } from './migration.types';
import * as prettier from 'prettier';

console.log('process.argv: ', process.argv);

if (process.argv.length < 3) {
  console.log('we need one argument (backoffice|core)');
  process.exit(1);
}

const migration_timestamp = new Date().getTime();

const schema_type = checkSchemaArg(process.argv[2]);

const dataSource = new DataSource({
  ...getSourceSchema(schema_type),
  schema: schema_type,
} as DataSourceOptions);

generateMigrations()
  .then(async ({ upSqls, downSqls }) => {
    if (upSqls.length < 1 && downSqls.length < 1) {
      console.log('No changes detected');
      process.exit(0);
    }
    console.log('upSqls: ', upSqls);
    console.log('downSqls: ', downSqls);

    console.log('Migration generated successfully');
    const fileContent = await getTemplate(
      'migration',
      migration_timestamp,
      upSqls,
      downSqls.reverse(),
      schema_type,
    );
    const filePath = path.join(
      __dirname,
      `../../src/database/migrations/${schema_type}/${migration_timestamp}-migration.ts`,
    );
    fs.writeFileSync(filePath, fileContent);
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

function queryParams(parameters: any[] | undefined): string {
  if (!parameters || !parameters.length) {
    return '';
  }
  return `, ${JSON.stringify(parameters)}`;
}

async function generateMigrations() {
  await dataSource.initialize();
  const logs = await dataSource.driver.createSchemaBuilder().log();
  const upSqls: string[] = [];
  const downSqls: string[] = [];

  logs.upQueries.forEach((upQuery) => {
    upSqls.push(setSchemaInQuery(upQuery, schema_type));
  });
  logs.downQueries.forEach((downQuery) => {
    downSqls.push(setSchemaInQuery(downQuery, schema_type));
  });

  return { upSqls, downSqls };
}

const setSchemaInQuery = (query: Query, schema: SchemaType) => {
  if (schema === 'core') {
    return `await queryRunner.query(\`${query.query.replace(/`/g, '\\`').replace(new RegExp(schema_type, 'g'), '${schema}')}\`${queryParams(query.parameters)});`;
  }
  return `await queryRunner.query(\`${query.query}\`${queryParams(query.parameters)});`;
};

function getTemplate(
  name: string,
  timestamp: number,
  upSqls: string[],
  downSqls: string[],
  schema_type: SchemaType,
): Promise<string> {
  const migrationName = `${camelCase(name, true)}${timestamp}`;
  const defineSchema = schema_type !== 'backoffice';
  const fileContent = `import { MigrationInterface, QueryRunner } from 'typeorm';
    ${defineSchema ? `import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';` : ''}


export class ${migrationName} implements MigrationInterface {
  name = '${migrationName}'

  public async up(queryRunner: QueryRunner): Promise<void> {
    ${defineSchema ? `const { schema } = queryRunner.connection.options as PostgresConnectionOptions;` : ''}
    ${upSqls.join('\n')}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    ${defineSchema ? `const { schema } = queryRunner.connection.options as PostgresConnectionOptions;` : ''}
    ${downSqls.join('\n')}
  }
}
`;
  return prettier.format(fileContent, {
    parser: 'typescript',
    singleQuote: true,
  });
}

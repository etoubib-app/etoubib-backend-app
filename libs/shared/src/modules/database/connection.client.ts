import { getClientSourceOptions, sanitizeDbSchema } from '@lib/shared';
import { AllClientEntities } from '@lib/shared/entities/client';
import { ExceptionErrorType } from '@lib/shared/types';
import { NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

const connections = new Map<string, DataSource>();

export async function getTenantConnection(
  schema_name: string,
): Promise<DataSource> {
  // TODO: issue with caching
  // if (connections.has(schema_name)) {
  //   console.log(`Connection for schema: ${schema_name} already exists`);
  //   const existingConnection = connections.get(schema_name);
  //   if (existingConnection?.isInitialized) {
  //     console.log(`Connection for schema: ${schema_name} is initialized`);
  //     return existingConnection;
  //   }
  //   try {
  //     // Reinitialize the connection if it's not initialized
  //     console.log(`Reinitializing connection for schema: ${schema_name}`);
  //     await existingConnection?.initialize();
  //     return existingConnection!;
  //   } catch (error) {
  //     console.error(
  //       `Error reinitializing connection for schema: ${schema_name}`,
  //       error,
  //     );
  //     throw new NotFoundException({
  //       error_code: ExceptionErrorType.TenantNotFound,
  //       message: `Tenant ID not found or failed to initialize`
  //     });
  //   }
  // }

  const safeSchema = sanitizeDbSchema(schema_name)
  try {
    // Create a new DataSource instance
    const newDataSource = new DataSource({
      ...getClientSourceOptions(),
      entities: AllClientEntities,
      migrations: undefined,
      name: safeSchema,
      schema: safeSchema,
      logging: false,
      poolSize: 1,
    });
    console.log('Initializing connection...', newDataSource.options);
    await newDataSource.initialize();
    console.log('+++ schema initialized +++');
    // await newDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema_name}"`); // TODO: fixme
    await newDataSource.query(`SET search_path TO "${schema_name}"`);
    const result = await newDataSource.query<{ schema: string }[]>(
      'SELECT current_schema() as schema',
    );
    if (result[0].schema !== safeSchema) {
      throw new NotFoundException({
        error_code: ExceptionErrorType.TenantNotFound,
        message: `Tenant ID not found`
      });
    }

    connections.set(safeSchema, newDataSource);
    return newDataSource;
  } catch (error) {
    console.log('Error creating connection', error);
    console.error(error);
    throw new NotFoundException({
      error_code: ExceptionErrorType.TenantNotFound,
      message: `Tenant ID not found`
    });
  }
}

export async function getTenantEntityManager(schema: string): Promise<EntityManager> {
  const safeSchema = sanitizeDbSchema(schema);
  const dataSource = await getTenantConnection(safeSchema)
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  return queryRunner.manager;
}
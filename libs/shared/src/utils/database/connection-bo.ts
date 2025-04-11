import {
  AllBackofficeEntities,
  CONNECTION,
  getBoSourceOptions,
} from '@lib/shared';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

export async function getTenantConnectionBO(): Promise<DataSource> {
  try {
    const schema_name = CONNECTION.BO;
    // Create a new DataSource instance
    const newDataSource = new DataSource({
      ...getBoSourceOptions(),
      entities: AllBackofficeEntities,
      migrations: undefined,
      name: schema_name,
      schema: schema_name,
      poolSize: 1,
    });
    console.log('Initializing connection...', newDataSource.options);
    await newDataSource.initialize();
    console.log('+++ schema initialized +++');
    await newDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema_name}"`);
    await newDataSource.query(`SET search_path TO "${schema_name}"`);
    const result = await newDataSource.query<{ schema: string }[]>(
      'SELECT current_schema() as schema',
    );
    if (result[0].schema !== schema_name) {
      throw new NotFoundException(`Schema "${schema_name}" not found`);
    }
    return newDataSource;
  } catch (error) {
    console.log('Error creating connection', error);
    console.error(error);
    throw new NotFoundException(`Schema "${schema_name}" not found`);
  }
}

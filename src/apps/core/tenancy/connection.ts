import { NotFoundException } from '@nestjs/common';
import { getCoreSourceOptions } from 'src/config/typeorm.core.config';
import { DataSource } from 'typeorm';
import { CoreUsers } from '../modules/users/entities/users.core.entity';

const connections = new Map<string, DataSource>();

export async function getTenantConnection(
  schema_name: string,
): Promise<DataSource> {
  if (connections.has(schema_name)) {
    console.log(`Connection for schema: ${schema_name} already exists`);
    const existingConnection = connections.get(schema_name);
    if (existingConnection?.isInitialized) {
      console.log(`Connection for schema: ${schema_name} is initialized`);
      return existingConnection;
    }
    try {
      // Reinitialize the connection if it's not initialized
      console.log(`Reinitializing connection for schema: ${schema_name}`);
      await existingConnection?.initialize();
      return existingConnection!;
    } catch (err) {
      console.error(
        `Error reinitializing connection for schema: ${schema_name}`,
        err,
      );
      throw new NotFoundException(
        `Schema "${schema_name}" not found or failed to initialize`,
      );
    }
  }
  console.log(`Creating connection for schema: ${schema_name}`);
  try {
    // Create a new DataSource instance
    const newDataSource = new DataSource({
      ...getCoreSourceOptions(),
      entities: [CoreUsers],
      migrations: undefined,
      name: schema_name,
      schema: schema_name,
      poolSize: 1,
    });
    console.log('Initializing connection...', newDataSource.options);
    await newDataSource.initialize();
    console.log('+++ schema initialized +++');
    await newDataSource.query(`SET search_path TO "${schema_name}"`);
    const result = await newDataSource.query<{ schema: string }[]>(
      'SELECT current_schema() as schema',
    );
    if (result[0].schema !== schema_name) {
      throw new NotFoundException(`Schema "${schema_name}" not found`);
    }

    connections.set(schema_name, newDataSource);
    return newDataSource;
  } catch (err) {
    console.log('Error creating connection', err);
    console.error(err);
    throw new NotFoundException(`Schema "${schema_name}" not found`);
  }
}

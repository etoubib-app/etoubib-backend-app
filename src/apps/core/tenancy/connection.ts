import { NotFoundException } from '@nestjs/common';
import { getCoreSourceOptions } from 'src/config/typeorm.core.config';
import { DataSource } from 'typeorm';
import { CoreClinics } from '../modules/clinics/entities/clinics.core.entity';

const connections = new Map<string, DataSource>();

export async function getTenantConnection(
  schema_name: string,
): Promise<DataSource> {
  console.log('connections: ', connections);
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
      entities: [CoreClinics],
      migrations: undefined,
    });
    console.log('Initializing connection...', newDataSource.options);
    await newDataSource.initialize();
    console.log('+++ schema initialized +++');
    await newDataSource.query(`SET search_path TO "${schema_name}"`);
    console.log('+++ schema initialized +++');
    connections.set(schema_name, newDataSource);

    return newDataSource;
  } catch (err) {
    console.log('Error creating connection', err);
    console.error(err);
    throw new NotFoundException(`Schema "${schema_name}" not found`);
  }
}

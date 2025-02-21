import { DataSourceOptions } from 'typeorm';
import { getBoSourceOptions } from '../../src/config/typeorm.backoffice.config';
import { getCoreSourceOptions } from '../../src/config/typeorm.core.config';
import { SchemaType } from './migration.types';

export const checkSchemaArg = (arg: string): SchemaType => {
  if (['backoffice', 'core'].includes(arg)) {
    console.log(`Processing '${arg}' schema`);
    return arg as SchemaType;
  }
  console.log('Please choose schema type can only be (backoffice) or (core)');
  process.exit(1);
};

export const getSourceSchema = (schema_type: SchemaType): DataSourceOptions => {
  const sourceArgs =
    schema_type === 'backoffice'
      ? getBoSourceOptions()
      : getCoreSourceOptions();
  return {
    ...sourceArgs,
  };
};

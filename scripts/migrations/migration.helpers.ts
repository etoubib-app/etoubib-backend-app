import { DataSourceOptions } from 'typeorm';
import { SchemaType } from './migration.types';
import { getBoSourceOptions, getCoreSourceOptions } from '@lib/shared';

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
  console.log('--- Source Schema:', sourceArgs);
  return {
    ...sourceArgs,
  };
};

import { DataSourceOptions } from 'typeorm';
import { SchemaType } from './migration.types';
import { getBoSourceOptions, getClientSourceOptions } from '@lib/shared';

export const checkSchemaArgument = (arg: string): SchemaType => {
  if (['backoffice', 'client'].includes(arg)) {
    console.log(`Processing '${arg}' schema`);
    return arg as SchemaType;
  }
  console.log('Please choose schema type can only be (backoffice) or (client)');
  process.exit(1);
};

export const getSourceSchema = (schema_type: SchemaType): DataSourceOptions => {
  const sourceArguments =
    schema_type === 'backoffice'
      ? getBoSourceOptions()
      : getClientSourceOptions();
  console.log('--- Source Schema:', sourceArguments);
  return {
    ...sourceArguments,
  };
};

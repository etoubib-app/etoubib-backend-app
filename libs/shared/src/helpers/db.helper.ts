/* eslint-disable unicorn/prevent-abbreviations */
import { BadRequestException } from '@nestjs/common';
import * as format from 'pg-format';

import { DB_SCHEMA_REGEX } from '../constants';
import { ExceptionErrorType } from '../types';

export function sanitizeDatabaseSchema(schema: string): string {
  if (!DB_SCHEMA_REGEX.test(schema)) {
    throw new BadRequestException({
      error_code: ExceptionErrorType.TenantIsInvalid,
      message: 'Tenant ID is invalid',
    });
  }
  return format('%I', schema); // escapes the identifier safely
}

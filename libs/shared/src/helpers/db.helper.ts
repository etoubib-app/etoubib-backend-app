import { BadRequestException } from '@nestjs/common';
import { DB_SCHEMA_REGEX } from '../constants';
import { ExceptionErrorType } from '../types';

// import not supported
const format = require('pg-format');

export function sanitizeDbSchema(schema: string): string {
    if (!DB_SCHEMA_REGEX.test(schema)) {
        throw new BadRequestException({
            error_code: ExceptionErrorType.TenantIsInvalid,
            message: 'Invalid Tenant ID provided',
        });
    }
    return format('%I', schema); // escapes the identifier safely
}
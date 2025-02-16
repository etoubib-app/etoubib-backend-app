import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  typeorm_url: process.env.TYPEORM_URL,
  typeorm_schema: process.env.TYPEORM_SCHEMA,
}));

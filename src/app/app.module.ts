import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app.config';
import dbConfig from '../config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig, appConfig],
    }),
  ],
})
export class AppModule {}

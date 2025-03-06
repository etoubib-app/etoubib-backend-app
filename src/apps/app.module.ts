import { appConfig, getDBSourceOptions } from '@lib/shared';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { BackofficeModule } from './backoffice/backoffice.module';
import { CoreModule } from './core/core.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDBSourceOptions(configService),
      inject: [ConfigService],
    }),
    BackofficeModule,
    CoreModule,
  ],
})
export class AppModule {}

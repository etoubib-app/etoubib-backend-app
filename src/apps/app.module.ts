import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import appConfig from '../config/app.config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BackofficeModule } from './backoffice/backoffice.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('TYPEORM_URL'),
        logging: true,
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    BackofficeModule,
    CoreModule,
  ],
})
export class AppModule {}

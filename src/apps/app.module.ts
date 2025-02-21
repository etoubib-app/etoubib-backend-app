import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import appConfig from '../config/app.config';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        type: 'postgres',
        url: configService.get('typeorm_url'),
        schema: configService.get('typeorm_schema'),
        logging: false,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}

import { Clinic } from '@lib/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClinicsController } from './clinics.controller';
import { ClinicsService } from './clinics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
  controllers: [ClinicsController],
  providers: [ClinicsService],
})
export class ClinicsModule {}

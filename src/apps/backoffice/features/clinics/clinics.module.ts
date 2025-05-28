import { BoDatabaseModule } from '@lib/shared/modules';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';

import { ClinicsController } from './clinics.controller';
import { ClinicsService } from './clinics.service';
import { ClinicEvent } from './events/clinic.event';
import { ClinicListener } from './listeners/clinic.listener';
import { ClinicRepositoryProvider } from './providers/clinic-repository.provider';

@Module({
  imports: [BoDatabaseModule, EventEmitterModule.forRoot()],
  providers: [
    ClinicsService,
    ClinicEvent,
    ClinicListener,
    ClinicRepositoryProvider, // Register our custom provider here
  ],
  controllers: [ClinicsController],
  exports: [ClinicRepositoryProvider],
})
export class ClinicsModule {}

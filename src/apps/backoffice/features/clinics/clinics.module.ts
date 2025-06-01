import { BoDatabaseModule, RepositoriesModule } from '@lib/shared/modules';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';

import { ClinicsController } from './clinics.controller';
import { ClinicListener } from './listeners/clinic.listener';
import { ClinicsService } from './services/clinics.service';
import { ClinicsListenerService } from './services/clinics-listener.service';
import { BoClinicSubscriber } from './subscribers/clinic.subscriber';

@Module({
  imports: [BoDatabaseModule, RepositoriesModule, EventEmitterModule.forRoot()],
  controllers: [ClinicsController],
  providers: [
    ClinicsListenerService,
    ClinicsService,
    ClinicListener,
    BoClinicSubscriber,
  ],
  exports: [],
})
export class ClinicsModule {}

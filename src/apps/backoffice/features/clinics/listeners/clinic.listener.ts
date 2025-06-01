import { BoClinic, logcall } from '@lib/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';

import { ClinicEvents } from '../events/clinic-events';
import { ClinicsListenerService } from '../services/clinics-listener.service';

@Injectable()
export class ClinicListener {
  private readonly logger = new Logger(ClinicListener.name);

  constructor(
    @Inject('ClinicRepositoryToken')
    private readonly clinicRepo: Repository<BoClinic>,
    private readonly clinicsListenerService: ClinicsListenerService,
  ) {}

  @OnEvent(ClinicEvents.ClinicInitializationStarted)
  @logcall()
  async onClinicInitializationStarted(payload: {
    clinicId: string;
  }): Promise<void> {
    try {
      await this.clinicsListenerService.handleClinicInitializationStarted(
        payload.clinicId,
      );
    } catch (error) {
      this.logger.error(
        `Error while initializing clinic ${payload.clinicId}: ${JSON.stringify(error)}`,
      );
    }
  }

  @OnEvent(ClinicEvents.ClinicSetupingStarted)
  @logcall()
  async onClinicSetupingStarted(payload: { clinicId: string }): Promise<void> {
    try {
      await this.clinicsListenerService.handleClinicSetupingStarted(
        payload.clinicId,
      );
    } catch (error) {
      this.logger.error(
        `Error while setting up clinic ${payload.clinicId}: ${JSON.stringify(error)}`,
      );
    }
  }
}

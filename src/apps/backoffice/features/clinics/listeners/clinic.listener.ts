import { BoClinic } from '@lib/shared';
import {
  ActivationStatus,
  SchemaMigrationStatus,
} from '@lib/shared/enums/backoffice';
import { generateClinicTenantId } from '@lib/shared/helpers/common.helper';
import { getTenantConnection } from '@lib/shared/modules/database/connection.client';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';

import { ClinicEvents } from '../events/clinic-events';

@Injectable()
export class ClinicListener {
  constructor(
    @Inject('ClinicRepositoryToken')
    private readonly clinicRepo: Repository<BoClinic>,
  ) {}

  @OnEvent(ClinicEvents.ClinicCreationUpdated)
  async handleClinicCreationUpdated(payload: {
    clinicId: string;
  }): Promise<void> {
    try {
      console.log(`Clinic creation updated for Clinic ${payload.clinicId}`);
      const clinic = await this.clinicRepo.findOneBy({ id: payload.clinicId });
      if (!clinic) throw new Error('Clinic not found');
      if (!clinic.tenantId) {
        generateClinicTenantId(clinic);
      }
      const schemaName = clinic.tenantId;
      console.log(`Migration started for Clinic ${payload.clinicId}`);
      // initialize tenant connection
      const dataSource = await getTenantConnection(schemaName);

      // run db migration scripts here
      await dataSource.runMigrations({ transaction: 'all' });
      await dataSource.destroy();

      if (!dataSource) {
        await this.handleMigrationFailed({
          clinicId: payload.clinicId,
        });
        throw new Error('Failed to initialize tenant connection');
      }

      console.log(`Migration completed for Clinic ${payload.clinicId}`);

      await this.handleMigrationSuccess({
        clinicId: payload.clinicId,
      });
    } catch (error) {
      console.error('Error updating clinic activation status:', error);
    }
  }

  @OnEvent(ClinicEvents.MigrationStarted)
  async handleMigrationStarted(payload: { clinicId: string }): Promise<void> {
    try {
      console.log(`Migration started for Clinic ${payload.clinicId}`);
      const clinic = await this.clinicRepo.findOneBy({ id: payload.clinicId });
      if (!clinic) return;
      if (!clinic.tenantId) {
        generateClinicTenantId(clinic);
      }
      clinic.migrationStatus = SchemaMigrationStatus.Running;
      await this.clinicRepo.save(clinic);
      console.log('Clinic updated:', clinic);
    } catch (error) {
      console.error('Error updating clinic activation status:', error);
    }
  }

  @OnEvent(ClinicEvents.MigrationSuccess)
  async handleMigrationSuccess(payload: { clinicId: string }): Promise<void> {
    try {
      console.log(`Migration succeeded for Clinic ${payload.clinicId}`);
      const clinic = await this.clinicRepo.findOneBy({ id: payload.clinicId });
      if (!clinic) return;
      if (!clinic.tenantId) {
        generateClinicTenantId(clinic);
      }
      clinic.activationStatus = ActivationStatus.Running;
      clinic.migrationStatus = SchemaMigrationStatus.Completed;
      await this.clinicRepo.save(clinic);
      console.log('Clinic updated:', clinic);
    } catch (error) {
      console.error('Error updating clinic activation status:', error);
    }
  }

  @OnEvent(ClinicEvents.MigrationFailed)
  async handleMigrationFailed(payload: { clinicId: string }): Promise<void> {
    try {
      console.error(`Migration failed for Clinic ${payload.clinicId}`);
      const clinic = await this.clinicRepo.findOneBy({ id: payload.clinicId });
      if (!clinic) return;
      if (!clinic.tenantId) {
        generateClinicTenantId(clinic);
      }
      clinic.activationStatus = ActivationStatus.Stopped;
      clinic.migrationStatus = SchemaMigrationStatus.Failed;
      await this.clinicRepo.save(clinic);
      console.log('Clinic updated:', clinic);
    } catch (error) {
      console.error('Error updating clinic activation status:', error);
    }
  }
}

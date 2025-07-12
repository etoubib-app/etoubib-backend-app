import { BoClinic, logcall } from '@lib/shared';
import { generateClinicTenantId } from '@lib/shared/helpers/common.helper';
import {
  BACKOFFICE_CONNECTION,
  CLINIC_REPOSITORY_TOKEN,
  getTenantConnection,
} from '@lib/shared/modules';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClinicsListenerService {
  private readonly logger = new Logger(ClinicsListenerService.name);

  constructor(
    @Inject(CLINIC_REPOSITORY_TOKEN)
    private readonly clinicsRepository: Repository<BoClinic>,
    @Inject(BACKOFFICE_CONNECTION)
    private readonly boDataSource: DataSource,
  ) {}

  @logcall()
  async handleClinicInitializationStarted(clinicId: string) {
    const clinic = await this.clinicsRepository.findOneBy({ id: clinicId });
    if (!clinic) {
      throw new InternalServerErrorException(
        `Clinic with ID ${clinicId} not found.`,
      );
    }
    try {
      // Ensure the clinic is in the correct stage before proceeding
      if (
        clinic.stage !== 'ready_for_initialization' &&
        clinic.stage !== 'initialization_failed'
      ) {
        throw new Error(
          `Clinic ${clinicId} is not on right stage to be initialized.`,
        );
      }
      // check if tenantId is already set
      if (!clinic.tenantId) {
        generateClinicTenantId(clinic);
      }
      // create schema for the clinic
      await this.boDataSource.query(
        `CREATE SCHEMA IF NOT EXISTS "${clinic.tenantId}";`,
      );
      await this.boDataSource.query(
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
      );
      // move to next stage
      clinic.stage = 'ready_for_setuping';
      await this.clinicsRepository.save(clinic);

      return clinic;
    } catch (error) {
      this.logger.error(
        `Error while initializing clinic ${clinicId}: ${JSON.stringify(error)}`,
      );
      clinic.stage = 'initialization_failed';
      if (error instanceof Error) {
        clinic.stageError = error.message;
      } else {
        clinic.stageError = `Unknown error during initialization at ${new Date().toISOString()}`;
      }
      await this.clinicsRepository.save(clinic);
    }
  }

  @logcall()
  async handleClinicSetupingStarted(clinicId: string) {
    const clinic = await this.clinicsRepository.findOneBy({ id: clinicId });
    if (!clinic) {
      throw new InternalServerErrorException(
        `Clinic with ID ${clinicId} not found.`,
      );
    }
    try {
      // Ensure the clinic is in the correct stage before proceeding
      if (
        clinic.stage !== 'ready_for_setuping' &&
        clinic.stage !== 'setup_failed'
      ) {
        throw new Error(
          `Clinic ${clinicId} is not on right stage to be setup.`,
        );
      }
      const clinicDataSource = await getTenantConnection(clinic.tenantId, true);
      if (!clinicDataSource) {
        throw new Error(
          `Failed to initialize tenant connection for clinic ${clinicId}.`,
        );
      }
      await clinicDataSource.query(
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
      );
      // log migrations

      this.logger.log(
        `Clinic DataSource migrations: ${JSON.stringify(clinicDataSource.options.migrations)}`,
      );
      this.logger.log(
        `Clinic DataSource options: ${JSON.stringify(clinicDataSource.options)}`,
      );
      this.logger.log(`Clinic DataSource: `);
      this.logger.log(clinicDataSource);

      // run db migration scripts here
      await clinicDataSource.runMigrations({ transaction: 'all' });
      await clinicDataSource.destroy();
      this.logger.log(
        `Migrations completed successfully for clinic ${clinicId}.`,
      );
      // move to next stage
      clinic.stage = 'ready_for_seeding';
      await this.clinicsRepository.save(clinic);
      return clinic;
    } catch (error) {
      this.logger.error(
        `Error while setting up clinic ${clinicId}: ${JSON.stringify(error)}`,
      );
      clinic.stage = 'setup_failed';
      if (error instanceof Error) {
        clinic.stageError = error.message;
      } else {
        clinic.stageError = `Unknown error during setup at ${new Date().toISOString()}`;
      }
      await this.clinicsRepository.save(clinic);
    }
  }
}

export const ClinicEvents = {
  ClinicCreationUpdated: 'clinic.creation.updated',
  MigrationStarted: 'clinic.migration.started',
  MigrationSuccess: 'clinic.migration.success',
  MigrationFailed: 'clinic.migration.failed',
  ClinicInitializationStarted: 'clinic.initialization.started',
  ClinicInitializationSuccess: 'clinic.initialization.success',
  ClinicInitializationFailed: 'clinic.initialization.failed',
  ClinicSetupingStarted: 'clinic.setup.started',
  ClinicSetupingSuccess: 'clinic.setup.success',
  ClinicSetupingFailed: 'clinic.setup.failed',
  ClinicSeedingStarted: 'clinic.seeding.started',
  ClinicSeedingSuccess: 'clinic.seeding.success',
  ClinicSeedingFailed: 'clinic.seeding.failed',
} as const;

export type ClinicEvents = (typeof ClinicEvents)[keyof typeof ClinicEvents];

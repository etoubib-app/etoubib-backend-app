export const ClinicEvents = {
  ClinicCreationUpdated: 'clinic.creation.updated',
  MigrationStarted: 'clinic.migration.started',
  MigrationSuccess: 'clinic.migration.success',
  MigrationFailed: 'clinic.migration.failed',
} as const;

export type ClinicEvents = (typeof ClinicEvents)[keyof typeof ClinicEvents];

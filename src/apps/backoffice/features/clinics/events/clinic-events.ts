export const ClinicEvents = {
  ClinicInitializationStarted: 'clinic.initialization.started',
  ClinicSetupingStarted: 'clinic.setup.started',
  ClinicSeedingStarted: 'clinic.seeding.started',
} as const;

export type ClinicEvents = (typeof ClinicEvents)[keyof typeof ClinicEvents];

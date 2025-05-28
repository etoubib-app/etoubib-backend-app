import { ExtractEnumTypes } from '@lib/shared/helpers';

// TODO: rename to BoClinicStatus
export const ActivationStatus = {
  Pending: 'pending', // Not yet activated
  Running: 'running', // Active
  Stopped: 'stopped', // Deactivated
  Failed: 'failed', // Activation failed
} as const;
export type TActivationStatus = ExtractEnumTypes<typeof ActivationStatus>;

// TODO: rename to BoClinicSetupStep
export const SchemaMigrationStatus = {
  Pending: 'pending', // Migration initiated
  Running: 'running', // Migration in progress
  Completed: 'completed', // Migration successful
  Failed: 'failed', // Migration failed
} as const;
export type TSchemaMigrationStatus = ExtractEnumTypes<
  typeof SchemaMigrationStatus
>;

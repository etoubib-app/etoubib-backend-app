export const ActivationStatus = {
  Pending: 'pending', // Not yet activated
  Running: 'running', // Active
  Stopped: 'stopped', // Deactivated
  Failed: 'failed', // Activation failed
} as const;
export type ActivationStatus =
  (typeof ActivationStatus)[keyof typeof ActivationStatus];

export const SchemaMigrationStatus = {
  Pending: 'pending', // Migration initiated
  Running: 'running', // Migration in progress
  Completed: 'completed', // Migration successful
  Failed: 'failed', // Migration failed
} as const;
export type SchemaMigrationStatus =
  (typeof SchemaMigrationStatus)[keyof typeof SchemaMigrationStatus];

export const CONNECTION = {
  CLIENT: 'client',
  BO: 'backoffice',
} as const;
export type CONNECTION = (typeof CONNECTION)[keyof typeof CONNECTION];

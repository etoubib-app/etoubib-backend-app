import { ClientRole } from './role.client.entity';
import { ClientRoleAuthorization } from './role-authorization.client.entity';
import { ClientUser } from './users.client.entity';

export * from './role.client.entity';
export * from './role-authorization.client.entity';
export * from './users.client.entity';

export const CLIENT_ENTITIES = [
  ClientUser,
  ClientRole,
  ClientRoleAuthorization,
];

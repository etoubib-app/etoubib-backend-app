import { BoClinic } from './clinics.bo.entity';
import { BoRole } from './role.bo.entity';
import { BoRoleAuthorization } from './role-authorization.bo.entity';
import { BoUserEntity } from './users.bo.entity';

export * from './clinics.bo.entity';
export * from './role.bo.entity';
export * from './role-authorization.bo.entity';
export * from './users.bo.entity';

export const BO_ENTITIES = [
  BoClinic,
  BoRole,
  BoRoleAuthorization,
  BoUserEntity,
];

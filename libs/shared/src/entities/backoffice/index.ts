import { BoClinic } from './clinics.entity';
import { Role } from './role.entity';
import { RoleAuthorization } from './role-authorization.entity';

export * from './clinics.entity';
export * from './role.entity';
export * from './role-authorization.entity';

export const AllBackofficeEntities = [BoClinic, Role, RoleAuthorization];

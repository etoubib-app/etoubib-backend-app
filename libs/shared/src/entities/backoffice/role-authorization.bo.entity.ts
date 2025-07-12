import { ResourceAuthorizations } from 'etoubib-shared';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BoRole } from './role.bo.entity';

@Entity('role_authorizations', { schema: 'backoffice' })
export class BoRoleAuthorization {
  @ManyToOne(() => BoRole, (role) => role.authorizations)
  @JoinColumn({ name: 'role_id' })
  role!: BoRole;

  @PrimaryColumn()
  role_id!: string;

  @PrimaryColumn({ type: 'varchar' })
  authorization!: ResourceAuthorizations;
}

import { ResourceAuthorizations } from 'etoubib-shared';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ClientRole } from './role.client.entity';

@Entity('role_authorizations')
export class ClientRoleAuthorization {
  @ManyToOne(() => ClientRole, (role) => role.authorizations)
  @JoinColumn({ name: 'role_id' })
  role!: ClientRole;

  @PrimaryColumn({ name: 'role_id', type: 'uuid' })
  roleId!: string;

  @PrimaryColumn({ type: 'varchar' })
  authorization!: ResourceAuthorizations;
}

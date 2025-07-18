import { ResourceAuthorizations } from 'etoubib-shared';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Role } from './role.client.entity';

@Entity('role_authorizations')
export class RoleAuthorization {
  @ManyToOne(() => Role, (role) => role.authorizations)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @PrimaryColumn({ name: 'role_id', type: 'uuid' })
  roleId!: string;

  @PrimaryColumn({ type: 'varchar' })
  authorization!: ResourceAuthorizations;
}

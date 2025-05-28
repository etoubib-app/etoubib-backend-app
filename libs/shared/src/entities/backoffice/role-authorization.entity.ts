import { ResourceAuthorizations } from 'etoubib-shared';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Role } from './role.entity';

@Entity('role_authorizations', { schema: 'backoffice' })
export class RoleAuthorization {
  @ManyToOne(() => Role, (role) => role.authorizations)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @PrimaryColumn()
  role_id: string;

  @Column({ type: 'varchar' })
  @PrimaryColumn()
  authorization: ResourceAuthorizations;
}

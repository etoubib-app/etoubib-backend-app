import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ClientRoleAuthorization } from './role-authorization.client.entity';

@Entity('roles')
export class ClientRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => ClientRoleAuthorization,
    (roleAuthorization) => roleAuthorization.role,
  )
  authorizations!: ClientRoleAuthorization[];

  @Column({ type: 'uuid', nullable: true })
  parent_id!: string;
}

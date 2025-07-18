import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoleAuthorization } from './role-authorization.client.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => RoleAuthorization,
    (roleAuthorization) => roleAuthorization.role,
  )
  authorizations!: RoleAuthorization[];

  @Column({ type: 'uuid', nullable: true })
  parent_id!: string;
}

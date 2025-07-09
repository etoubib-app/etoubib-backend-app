import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BoRoleAuthorization } from './role-authorization.bo.entity';

@Entity('roles', { schema: 'backoffice' })
export class BoRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => BoRoleAuthorization,
    (roleAuthorization) => roleAuthorization.role,
  )
  authorizations!: BoRoleAuthorization[];
}

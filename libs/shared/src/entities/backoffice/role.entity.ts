import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoleAuthorization } from './role-authorization.entity';

@Entity({ schema: 'backoffice' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => RoleAuthorization,
    (roleAuthorization) => roleAuthorization.role,
  )
  authorizations: RoleAuthorization[];
}

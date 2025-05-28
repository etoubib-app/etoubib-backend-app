import * as bcrypt from 'bcryptjs';
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base';
import { bycryptHashPassword } from '@lib/shared/helpers';
import {
  type TClientUserStatus,
  ClientUserStatus,
} from '@lib/shared/enums/client';

@Entity({ name: 'users' })
export class ClientUserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'first_name',
    length: 255,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    length: 255,
    nullable: true,
  })
  lastName?: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    length: 255,
  })
  @Exclude()
  private _password: string;

  @Column({ type: 'varchar', default: ClientUserStatus.active })
  status: TClientUserStatus;

  @Column({
    type: 'boolean',
    name: 'is_owner',
    default: false,
  })
  isOwner: boolean;

  constructor(data: Partial<ClientUserEntity> = {}) {
    super();
    Object.assign(this, data);
  }

  get password(): string {
    return this._password;
  }
  async setPassword(value: string): Promise<void> {
    this._password = await bycryptHashPassword(value);
  }
  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this._password);
  }
}

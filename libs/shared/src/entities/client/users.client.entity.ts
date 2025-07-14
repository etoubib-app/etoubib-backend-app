import { UserStatus, type TUserStatus } from '@lib/shared/enums/client';
import { bycryptHashPassword } from '@lib/shared/helpers';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'first_name',
    length: 255,
  })
  firstName!: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    length: 255,
  })
  lastName!: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email!: string;

  @Column({
    type: 'varchar',
    name: 'password',
    length: 255,
    select: false,
  })
  @Exclude()
  private _password!: string;

  @Column({ type: 'varchar', default: UserStatus.active })
  status!: TUserStatus;

  @Column({ type: 'boolean', default: false })
  isOwner?: boolean;

  constructor(data: Partial<User> = {}) {
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

  toSafeObject(): Omit<this, '_password'> {
    const { _password, ...rest } = this as any; // TODO: fix type assertion
    return rest;
  }

  checkUserStatus(): boolean {
    if (this.status == UserStatus.inactive) {
      throw new UnauthorizedException('User inactive not authorized to login');
    }
    if (this.status == UserStatus.blocked) {
      throw new UnauthorizedException('User blocked not authorized to login');
    }
    return true;
  }
}

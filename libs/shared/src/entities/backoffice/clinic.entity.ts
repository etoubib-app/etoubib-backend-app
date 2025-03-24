import { ActivationStatus, SchemaMigrationStatus } from '@lib/shared/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'backoffice' })
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  tenantId: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: ActivationStatus.Pending })
  activationStatus: ActivationStatus;

  @Column({ type: 'varchar', default: SchemaMigrationStatus.Pending })
  migrationStatus: SchemaMigrationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

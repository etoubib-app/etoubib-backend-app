import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ActivationStatus,
  TActivationStatus,
  TSchemaMigrationStatus,
  SchemaMigrationStatus
} from '@lib/shared/enums/backoffice';

// TODO: extends BaseEntity and use snake_case for db columns
@Entity({ schema: 'backoffice', name: "clinics" })
export class BoClinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  tenantId: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: ActivationStatus.Pending })
  activationStatus: TActivationStatus;

  @Column({
    type: 'varchar',
    default: SchemaMigrationStatus.Pending,
    nullable: true,
  })
  migrationStatus: TSchemaMigrationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// TODO: clean comments
/*
stages:

pending -> migration-init -> migration-success -> seed-init -> seed-success -> ready
                          -> migration-failed
                                                            -> seed-failed
*/

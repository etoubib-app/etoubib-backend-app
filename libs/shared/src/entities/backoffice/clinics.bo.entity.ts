import {
  BoClinicStatus,
  TBoClinicStage,
  TBoClinicStatus,
} from '@lib/shared/enums/backoffice';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clinics', { schema: 'backoffice', name: 'clinics' })
export class BoClinic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', unique: true, nullable: true })
  tenantId!: string;

  @Column({ name: 'name', unique: true })
  name!: string;

  @Column({ name: 'email', unique: true })
  email!: string;

  @Column({ name: 'status', type: 'varchar', default: BoClinicStatus.Draft })
  status!: TBoClinicStatus;

  @Column({
    name: 'stage',
    type: 'varchar',
    nullable: true,
  })
  stage!: TBoClinicStage;

  @Column({ name: 'stage_error', type: 'text', nullable: true })
  stageError?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

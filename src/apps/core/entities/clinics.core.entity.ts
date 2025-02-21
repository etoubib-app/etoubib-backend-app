import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clinics' })
export class CoreClinics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}

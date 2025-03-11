import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'backoffice' })
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  lastName?: string;
}

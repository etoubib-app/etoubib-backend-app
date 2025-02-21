import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'backoffice' })
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}

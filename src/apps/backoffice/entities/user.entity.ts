import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'backoffice' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}

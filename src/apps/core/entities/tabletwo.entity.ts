import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'table_two' })
export class TableTwo {
  @PrimaryGeneratedColumn()
  id: number;
}

import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@lib/shared/base';
import { QuestionEntity } from './question.client.entity';

@Entity({ name: 'forms' })
export class FormEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  // TODO: add status ( published, draft ) ?

  @OneToMany(() => QuestionEntity, question => question.form)
  questions: QuestionEntity[];

  constructor(data: Partial<FormEntity> = {}) {
    super();
    Object.assign(this, data);
  }
}
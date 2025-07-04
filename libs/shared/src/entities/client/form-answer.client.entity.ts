import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '@lib/shared/base';
import { PatientEntity } from './patient.client.entity';
import { QuestionEntity } from './question.client.entity';

@Index(['patient', 'question'], { unique: true })
@Entity({ name: 'form_answers' })
export class FormAnswerEntity extends BaseEntity {
  @ManyToOne(() => PatientEntity, (patient) => patient.answers, {
    onDelete: 'CASCADE',
  })
  patient: PatientEntity;

  @ManyToOne(() => QuestionEntity, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: QuestionEntity;

  @Column({ name: 'answer_json', type: 'json', nullable: true })
  answer: boolean | string | string[] | null;

  constructor(data: Partial<FormAnswerEntity> = {}) {
    super();
    Object.assign(this, data);
  }
}

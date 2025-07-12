import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { FormAnswerEntity } from './form-answer.client.entity';
import { BaseEntity } from '@lib/shared/base';
import { TQuestionType } from '@lib/shared/enums/client';
import { FormEntity } from './form.client.entity';

@Entity({ name: 'questions' })
export class QuestionEntity extends BaseEntity {
  @Column({ type: 'text' })
  question!: string;

  @Column({ type: "int" })
  position!: number;

  @Column({ type: 'varchar' })
  type!: TQuestionType;

  @Column({ name: 'options_json', type: 'json', nullable: true })
  optionsJson?: string[] | null;

  @ManyToOne(() => FormEntity, form => form.questions, { onDelete: 'CASCADE' })
  form!: FormEntity;

  @OneToMany(() => FormAnswerEntity, answer => answer.question)
  answers!: FormAnswerEntity[];

  constructor(data: Partial<QuestionEntity> = {}) {
    super();
    Object.assign(this, data);
  }
}
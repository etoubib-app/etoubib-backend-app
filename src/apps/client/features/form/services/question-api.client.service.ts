import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CLIENT_CONNECTION } from '@lib/shared/modules';
import { DataSource, Repository } from 'typeorm';
import { AddQuestionToFormDto } from '../dtos';
import { FormEntity, QuestionEntity } from '@lib/shared';
import { BaseService } from '@lib/shared/base';

@Injectable({ scope: Scope.REQUEST })
export class QuestionApiService extends BaseService<QuestionEntity> {
  protected readonly questionRepository: Repository<QuestionEntity>;
  protected readonly formRepository: Repository<FormEntity>;

  constructor(@Inject(CLIENT_CONNECTION) protected connection: DataSource) {
    super(connection.getRepository(QuestionEntity));
    this.formRepository = this.connection.getRepository(FormEntity)
    this.questionRepository = this.repository
  }

  async addQuestionToForm(dto: AddQuestionToFormDto): Promise<QuestionEntity> {
    try {
      const form = await this.formRepository.findOneOrFail({ where: { id: dto.form_id }, relations: { questions: true } });
      const question = await this.questionRepository.save({ ...dto, form, position: form.questions.length + 1 })
      return question
    } catch (error) {
      this.handleDbError(error);
    }
  }

  // TODO: fix DTO and test
  async updateQuestion(id: string, data: AddQuestionToFormDto): Promise<QuestionEntity> {
    const question = await this.questionRepository.preload({ id, ...data } as any);
    if (!question) throw new NotFoundException({ message: `${this.entityName} with id ${id} not found` });
    // TODO: check if question is used in any form answers

    try {
      return await this.questionRepository.save(question);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async deleteQuestion(id: string): Promise<{ message: string }> {
    const question = await this.findOne(id);
    // TODO: check if question is used in any form answers

    try {
      await this.questionRepository.remove(question);
      return { message: `${this.entityName} with id ${id} has been deleted` };
    } catch (error) {
      this.handleDbError(error);
    }
  }
}

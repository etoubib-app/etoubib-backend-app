import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CLIENT_CONNECTION } from '@lib/shared/modules';
import { DataSource, Repository } from 'typeorm';
import { AddQuestionToFormDto, UpdateQuestionDto } from '../dtos';
import { FormAnswerEntity, FormEntity, QuestionEntity } from '@lib/shared';
import { BaseService } from '@lib/shared/base';

@Injectable({ scope: Scope.REQUEST })
export class QuestionApiService extends BaseService<QuestionEntity> {
  protected readonly questionRepository: Repository<QuestionEntity>;
  protected readonly formRepository: Repository<FormEntity>;
  protected readonly formAnswerRepository: Repository<FormAnswerEntity>;

  constructor(@Inject(CLIENT_CONNECTION) protected connection: DataSource) {
    super(connection.getRepository(QuestionEntity));
    this.formRepository = this.connection.getRepository(FormEntity);
    this.formAnswerRepository = this.connection.getRepository(FormAnswerEntity);
    this.questionRepository = this.repository;
  }

  async addQuestionToForm(dto: AddQuestionToFormDto): Promise<QuestionEntity> {
    try {
      const form = await this.formRepository.findOneOrFail({
        where: { id: dto.form_id },
        relations: { questions: true },
      });
      const question = await this.questionRepository.save({
        ...dto,
        form,
        position: form.questions.length + 1,
      });
      return question;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  override async update(
    id: string,
    data: UpdateQuestionDto,
  ): Promise<QuestionEntity> {
    const question = await this.questionRepository.preload({
      id,
      ...data,
    } as any);
    if (!question)
      throw new NotFoundException({
        message: `Question with id ${id} not found`,
      });

    // check if question is used in any form answers
    const existingAnswers = await this.formAnswerRepository.find({
      where: { question: { id } },
    });
    if (existingAnswers.length > 0) {
      throw new ConflictException({
        message: `Question with id ${id} is used in form answers and cannot be updated`,
      });
    }

    try {
      return await this.questionRepository.save(question);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  override async remove(id: string): Promise<{ message: string }> {
    const question = await this.findOne(id);

    // check if question is used in any form answer
    const existingAnswers = await this.formAnswerRepository.find({
      where: { question: { id } },
    });
    if (existingAnswers.length > 0) {
      throw new ConflictException({
        message: `Question with id ${id} is used in form answers and cannot be deleted`,
      });
    }

    try {
      await this.questionRepository.remove(question);
      return { message: `Question with id ${id} has been deleted` };
    } catch (error) {
      this.handleDbError(error);
    }
  }
}

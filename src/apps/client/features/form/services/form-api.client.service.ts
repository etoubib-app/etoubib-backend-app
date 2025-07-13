import { Inject, Injectable, Scope } from '@nestjs/common';
import { CLIENT_CONNECTION } from '@lib/shared/modules';
import { DataSource, Repository } from 'typeorm';
import { SoftDeleteBaseService } from '@lib/shared/base/services/soft-delete-base.service';
import { CreateFormDto } from '../dtos';
import { PaginationQueryDto } from '@lib/shared/dto';
import { TPaginatedData } from '@lib/shared/types';
import { FormEntity, QuestionEntity } from '@lib/shared';


@Injectable({ scope: Scope.REQUEST })
export class FormApiService extends SoftDeleteBaseService<FormEntity> {
  protected readonly formRepository: Repository<FormEntity>;
  protected readonly questionRepository: Repository<QuestionEntity>;

  constructor(@Inject(CLIENT_CONNECTION) protected connection: DataSource) {
    super(connection.getRepository(FormEntity));
    this.questionRepository = connection.getRepository(QuestionEntity);
    this.formRepository = this.repository
  }

  override async findAll(query: PaginationQueryDto): Promise<TPaginatedData<FormEntity>> {
    return super.findAll(query, {
      relations: { questions: true },
      order: {
        createdAt: 'DESC',
        questions: { position: 'ASC' },
      },
    })
  }

  override async findOne(id: string,): Promise<FormEntity> {
    return super.findOne(id, {
      relations: { questions: true },
      order: { questions: { position: 'ASC' } },
    })
  }

  async createFormWithQuestions(dto: CreateFormDto): Promise<FormEntity> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const form = queryRunner.manager.create(FormEntity, { title: dto.title });
      const savedForm = await queryRunner.manager.save(form);

      const questions = dto.questions.map((question, index) =>
        queryRunner.manager.create(QuestionEntity, { ...question, position: index + 1, form: savedForm }),
      );
      await queryRunner.manager.save(questions);

      await queryRunner.commitTransaction();
      return { ...savedForm, questions };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbError(error);
    } finally {
      await queryRunner.release();
    }
  }

}

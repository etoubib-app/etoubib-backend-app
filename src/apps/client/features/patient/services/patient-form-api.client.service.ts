import { CLIENT_CONNECTION } from "@lib/shared/modules";
import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { FormAnswerEntity, FormEntity, handleDbError, PatientEntity } from "@lib/shared";
import { FillFormDto } from "../../form/dtos";
import { DataSource, Repository } from "typeorm";
import { validateQuestionAnswer } from "../../form/validators/is-form-answer-valid.validator";

@Injectable({ scope: Scope.REQUEST })
export class PatientFormApiService {
    protected readonly formRepository: Repository<FormEntity>;
    protected readonly patientRepository: Repository<PatientEntity>;
    protected readonly formAnswerRepository: Repository<FormAnswerEntity>;

    constructor(@Inject(CLIENT_CONNECTION) protected connection: DataSource) {
        this.formRepository = this.connection.getRepository(FormEntity);
        this.patientRepository = this.connection.getRepository(PatientEntity);
        this.formAnswerRepository = this.connection.getRepository(FormAnswerEntity);
    }

    async fillPatientForm(patientId: string, formId: string, dto: FillFormDto): Promise<FormAnswerEntity[]> {
        try {
            return await this.connection.transaction(async (manager) => {
                const form = await manager.findOneOrFail(FormEntity, { where: { id: formId }, relations: ['questions'] });
                const patient = await manager.findOneOrFail(PatientEntity, { where: { id: patientId } });

                const answersToSave: FormAnswerEntity[] = [];
                for (const answerDto of dto.answers) {
                    const question = form.questions.find((q) => q.id === answerDto.questionId);
                    if (!question) throw new NotFoundException(`Question ${answerDto.questionId} not in form`);

                    // skip section type questions
                    if (question.type === "section") continue;

                    // validate answer based on question type
                    const answer = answerDto.answer;
                    validateQuestionAnswer({ answer, question });

                    // check for existing answer
                    let existingAnswer = await manager.findOne(FormAnswerEntity, {
                        where: { patient: { id: patientId }, question: { id: question.id } },
                    });

                    if (existingAnswer) {
                        existingAnswer.answer = answer;
                        answersToSave.push(existingAnswer);
                    } else {
                        const newAnswer = manager.create(FormAnswerEntity, { patient, question, answer: answer });
                        answersToSave.push(newAnswer);
                    }
                }
                await manager.save(answersToSave);

                // refetch patient answers
                return await manager.find(FormAnswerEntity, {
                    relations: ['question'],
                    where: { patient: { id: patientId }, question: { form: { id: formId } } },
                });
            })
        } catch (error) {
            handleDbError(error);
        }
    }

    async getPatientFormAnswers(patientId: string, formId: string) {
        try {
            await this.patientRepository.findOneOrFail({ where: { id: patientId } });
            const form = await this.formRepository.findOneOrFail(
                { where: { id: formId }, relations: ['questions'], order: { questions: { position: 'ASC' } } }
            );

            const formAnswers = await this.formAnswerRepository.find({
                relations: ['question'],
                where: { patient: { id: patientId }, question: { form: { id: formId } } },
            });

            // merge form questions with patient answers
            return {
                ...form,
                questions: form.questions.map((question) => {
                    const formAnswer = formAnswers.find((a) => a.question.id === question.id);
                    return { ...question, answer: formAnswer ? formAnswer.answer : undefined };
                })
            }
        } catch (error) {
            handleDbError(error);
        }
    }
}
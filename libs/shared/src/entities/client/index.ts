export * from './users.client.entity'; // TODO: clean duplicate exports
import { ClientUserEntity } from './users.client.entity';
import { PatientEntity } from './patient.client.entity';
import { AddressEntity } from './address.client.entity';
import { QuestionEntity } from './question.client.entity';
import { FormEntity } from './form.client.entity';
import { FormAnswerEntity } from './form-answer.client.entity';

export const AllClientEntities = [
    ClientUserEntity, PatientEntity, AddressEntity, QuestionEntity, FormEntity, FormAnswerEntity
];

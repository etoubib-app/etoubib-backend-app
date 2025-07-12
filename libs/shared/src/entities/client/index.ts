import { ClientRole } from './role.client.entity';
import { ClientRoleAuthorization } from './role-authorization.client.entity';
import { ClientUser } from './users.client.entity';
import { PatientEntity } from './patient.client.entity';
import { AddressEntity } from './address.client.entity';
import { QuestionEntity } from './question.client.entity';
import { FormEntity } from './form.client.entity';
import { FormAnswerEntity } from './form-answer.client.entity';

export * from './users.client.entity';
export * from './role.client.entity';
export * from './role-authorization.client.entity';

// TODO: merge !!
export const CLIENT_ENTITIES = [
  ClientUser,
  ClientRole,
  ClientRoleAuthorization,
  PatientEntity,
  AddressEntity,
  QuestionEntity,
  FormEntity,
  FormAnswerEntity
];
export * from './users.client.entity'; // TODO: clean duplicate exports
import { ClientUserEntity } from './users.client.entity'; // TODO: prefix with core instead of client
import { PatientEntity } from './patient.client.entity';
import { AddressEntity } from './address.client.entity';

export const AllClientEntities = [ClientUserEntity, PatientEntity, AddressEntity];

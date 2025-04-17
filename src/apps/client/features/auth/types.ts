import { type ClientUserWithRelationsResponseDto } from '../users/dtos';

export type TClientJwtPayload = {
  userId: string;
  tenantId: string;
};

export type TClientAuthUser = InstanceType<
  typeof ClientUserWithRelationsResponseDto
>;

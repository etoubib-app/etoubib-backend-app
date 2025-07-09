import { ClientUserWithRelationsResponseDto } from '../../dto';

export type JwtPayload = {
  userId: string;
  tenantId: string;
  is_bo_user?: boolean;
};

export type TAuthUser = InstanceType<typeof ClientUserWithRelationsResponseDto>;
// export type TAuthUser = InstanceType<typeof ClientUserWithRelationsResponseDto> | InstanceType<typeof BoUserWithRelationsResponseDto>;

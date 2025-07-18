import { UserResponseDto } from '../../dto';

export type JwtPayload = {
  userId: string;
  tenantId: string;
  is_bo_user?: boolean;
};

export type TAuthUser = InstanceType<typeof UserResponseDto>;
// export type TAuthUser = InstanceType<typeof UserResponseDto> | InstanceType<typeof BoUserWithRelationsResponseDto>;

import { type ClientUserWithRelationsResponseDto } from "../users/dtos";

export type TClientJwtPayload = {
    userId: string;
    tenantId: string;
    // TODO: add user loggedAt
}

export type TClientAuthUser = InstanceType<typeof ClientUserWithRelationsResponseDto> 
import { type BoUserResponseDto } from "../users/dtos";

export type TBoJwtPayload = {
    userId: string;
    loggedtAt: string;
}

export type TBoAuthUser = InstanceType<typeof BoUserResponseDto> 
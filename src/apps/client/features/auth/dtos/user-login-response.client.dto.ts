import { ApiProperty } from '@nestjs/swagger';
import { ClientUserWithRelationsResponseDto } from '../../users/dtos';

export class ClientUserLoginResponseDto {
    @ApiProperty({ example: { accessToken: "token" } })
    tokens: { accessToken: string; };

    @ApiProperty()
    user: ClientUserWithRelationsResponseDto;
}
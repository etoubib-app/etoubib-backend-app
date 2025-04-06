import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponseDto {
    @ApiProperty({ example: "123" })
    id: string;

    @ApiProperty({ example: "" })
    createdAt: Date;

    @ApiProperty({ example: "" })
    updatedAt: Date;
}
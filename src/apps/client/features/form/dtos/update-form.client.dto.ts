import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateFormDto {
    @ApiProperty({ example: 'Example Form' })
    @IsString()
    @IsOptional()
    title!: string;
}

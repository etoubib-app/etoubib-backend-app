import { QuestionType, TQuestionType } from "@lib/shared/enums/client";
import { getEnumValues } from "@lib/shared/helpers/common.helper";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";

export class UpdateQuestionDto {
    @IsOptional()
    @ApiProperty({ example: 'What are your symptoms?' })
    @IsString()
    question?: string;

    @IsOptional()
    @ApiProperty({
        enum: getEnumValues(QuestionType),
        example: QuestionType.multi_choice,
    })
    @IsEnum(QuestionType)
    type?: TQuestionType;

    @ApiProperty({ nullable: true, example: ['Fever', 'Cough', 'Fatigue'] })
    @ValidateIf((o) => o.type === QuestionType.multi_choice)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    optionsJson?: string[];
}
import { QuestionType, TQuestionType } from "@lib/shared/enums/client";
import { getEnumValues } from "@lib/shared/helpers/common.helper";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateQuestionDto {
    @ApiProperty({ example: 'What are your symptoms?' })
    @IsString()
    @IsNotEmpty()
    question!: string;

    @ApiProperty({
        enum: getEnumValues(QuestionType),
        example: QuestionType.multi_choice,
    })
    @IsEnum(QuestionType)
    type!: TQuestionType;

    @ApiProperty({
        nullable: true,
        required: false,
        example: ['Fever', 'Cough', 'Fatigue'],
    })
    @ValidateIf((o) => o.type === QuestionType.multi_choice)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    optionsJson?: string[];
}

export class AddQuestionToFormDto extends CreateQuestionDto {
    @IsUUID()
    @ApiProperty({ example: '9542089b-6e3f-41dd-b389-f7e110366dd4' })
    form_id!: string;
}
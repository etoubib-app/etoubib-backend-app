import { BaseResponseDto } from '@lib/shared/base';
import { QuestionType, TQuestionType } from '@lib/shared/enums/client';
import { getEnumValues } from '@lib/shared/helpers/common.helper';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionResponseDto extends BaseResponseDto {
    @ApiProperty({ example: 'What are your symptoms?' })
    question!: string;

    @ApiProperty({ example: 1 })
    position!: number;

    @ApiProperty({
        enum: getEnumValues(QuestionType),
        example: QuestionType.multi_choice,
        description: 'Type of the question: text, yes_no, section, or multi_choice',
    })
    type!: TQuestionType;

    @ApiProperty({
        nullable: true,
        required: false,
        example: ['Fever', 'Cough', 'Fatigue'],
        description: 'Only present when type is "multi_choice"',
    })
    optionsJson?: string[] | null;
}

export class QuestionAnswerResponseDto extends QuestionResponseDto {
    @ApiProperty({ example: ['Fever'], nullable: true, required: false })
    answer?: boolean | string | string[] | null;
}
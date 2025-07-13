import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@lib/shared/base';
import { QuestionResponseDto } from './question-response.client.dto';

export class FormResponseDto extends BaseResponseDto {
    @ApiProperty({ example: 'Example Form' })
    title!: string;

    @ApiProperty({ type: [QuestionResponseDto] })
    @Type(() => QuestionResponseDto)
    questions!: QuestionResponseDto[];
}
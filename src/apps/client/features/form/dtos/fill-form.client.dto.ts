import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { IsValidFormAnswer } from '../validators';

export class FillFormAnswerDto {
  @ApiProperty({ example: '6aeafced-0e54-47db-8978-5b56463ec99e' })
  @IsUUID()
  questionId!: string;

  @ApiProperty({
    example: 'Some answer...',
    oneOf: [
      { type: 'boolean' },
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
      { type: 'null' },
    ],
  })
  @IsValidFormAnswer()
  answer!: boolean | string | string[] | null;
}

export class FillFormDto {
  @ApiProperty({ type: [FillFormAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FillFormAnswerDto)
  answers!: FillFormAnswerDto[];
}

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateQuestionDto } from './create-question.client.dto';

export class CreateFormDto {
  @ApiProperty({ example: 'Example Form' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: [CreateQuestionDto],
    example: [
      {
        question: 'Main section',
        type: 'section',
      },
      {
        type: 'yes_no',
        question: 'Do you have any allergies?',
      },
      {
        type: 'multi_choice',
        question: 'What are your symptoms?',
        optionsJson: ['Cough', 'Fever', 'Fatigue'],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions!: CreateQuestionDto[];
}

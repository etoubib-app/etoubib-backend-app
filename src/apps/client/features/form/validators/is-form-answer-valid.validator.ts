import { QuestionEntity } from '@lib/shared';
import { BadRequestException } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsValidFormAnswer(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsValidFormAnswer',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value === undefined) return false;

                    const isNullable = value === null;
                    const isString = typeof value === 'string';
                    const isBoolean = typeof value === 'boolean';
                    const isStringArray =
                        Array.isArray(value) && value.every((v) => typeof v === 'string');

                    return isNullable || isBoolean || isString || isStringArray;
                },
                defaultMessage(args: ValidationArguments) {
                    return `$property must be a null, boolean, string, or array of strings and cannot be undefined`;
                },
            },
        });
    };
}

export function validateQuestionAnswer({
    answer,
    question,
}: {
    answer: boolean | string | string[] | null;
    question: QuestionEntity;
}) {
    const { type, id, optionsJson } = question;

    if (type === 'yes_no') {
        if (answer !== null && typeof answer !== 'boolean')
            throw new BadRequestException(`Expected boolean or null for yes/no question ${id}`);
    }

    if (type === 'text') {
        if (typeof answer !== 'string')
            throw new BadRequestException(`Expected string for text question ${id}`);
    }

    if (type === 'multi_choice') {
        if (!Array.isArray(answer))
            throw new BadRequestException(`Expected array for multi_choice question ${id}`);

        const invalidOptions = answer.filter((opt) => !optionsJson?.includes(opt));
        if (invalidOptions.length > 0)
            throw new BadRequestException(
                `Invalid options for multi_choice question ${id}. Allowed values: ${optionsJson?.join(', ')}`
            );
    }
}
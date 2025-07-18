import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ExactlyOneAddressField(validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      name: 'ExactlyOneAddressField',
      target: constructor,
      propertyName: undefined!,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          const hasAddress = !!obj.address;
          const hasAddressId = !!obj.address_id;
          return (hasAddress && !hasAddressId) || (!hasAddress && hasAddressId);
        },
        defaultMessage(): string {
          return 'You must provide either "address" or "address_id", but not both';
        },
      },
    });
  };
}

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCurrency', async: false })
export class IsCurrencyStringConstraint
  implements ValidatorConstraintInterface
{
  validate(propertyValue: string) {
    const nValue = Number.parseFloat(propertyValue);
    if (nValue < 0) {
      return false;
    }
    if (10000000000 <= nValue) {
      // ToDo: Artificial limit
      return false;
    }
    return nValue.toFixed(2) === propertyValue;
  }

  defaultMessage({ value }: ValidationArguments) {
    return `${value} must be on currency format and be a positive number, with at most 10 digits`;
  }
}

@ValidatorConstraint({ name: 'isEnumList', async: false })
export class IsEnumList implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const enums: Record<string, any>[] = args.constraints;
    const values = text.split(',').filter((value) => value && value != '');

    return (
      values.filter(
        (value) => enums.filter((enumItem) => enumItem[value]).length,
      ).length == values.length
    );
  }

  defaultMessage({ value }: ValidationArguments) {
    return `${value} must be a valid enum value`;
  }
}

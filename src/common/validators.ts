// import { Prisma } from '@prisma/client';
import {
  registerDecorator,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
// import parsePhoneNumber from 'libphonenumber-js/max';
// import { sanitizeString } from './format';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const dumbPasswords = require('dumb-passwords');

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

// export function IsCurrencyString(validationOptions?: ValidationOptions) {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: IsCurrencyStringConstraint,
//     });
//   };
// }

// @ValidatorConstraint({ name: 'isCurrencyAmount', async: false })
// export class IsCurrencyAmount implements ValidatorConstraintInterface {
//   validate(propertyValue: any) {
//     const precision = 2;
//     const nValue = new Prisma.Decimal(propertyValue.quantity);
//     if (nValue.lte(0)) {
//       return false;
//     }
//     return nValue.dp() <= precision;
//   }
//
//   defaultMessage({ value }: ValidationArguments) {
//     return `${value} must be on currency amount`;
//   }
// }

@ValidatorConstraint({ name: 'IsMonth', async: false })
export class IsMonth implements ValidatorConstraintInterface {
  validate(propertyValue: number) {
    return (
      Math.trunc(propertyValue) === propertyValue &&
      propertyValue > 0 &&
      propertyValue < 13
    );
  }

  defaultMessage({ value }: ValidationArguments) {
    return `${value} is not a valid month number`;
  }
}

@ValidatorConstraint({ name: 'IsYear', async: false })
export class IsYear implements ValidatorConstraintInterface {
  validate(propertyValue: number) {
    return (
      Math.trunc(propertyValue) === propertyValue &&
      propertyValue > 999 &&
      10000 > propertyValue
    );
  }

  defaultMessage({ value }: ValidationArguments) {
    return `${value} is not a valid year number`;
  }
}

// @ValidatorConstraint({ name: 'IsE164PhoneNumber', async: false })
// export class IsE164PhoneNumber implements ValidatorConstraintInterface {
//   validate(propertyValue: string) {
//     try {
//       const parsedPhoneValid = parsePhoneNumber(propertyValue, {
//         defaultCountry: undefined,
//         extract: false,
//       });
//       return Boolean(parsedPhoneValid?.isValid());
//     } catch (err) {
//       return false;
//     }
//   }
//
//   defaultMessage({ value }: ValidationArguments) {
//     return `${value} is not a valid phone`;
//   }
// }

@ValidatorConstraint({ name: 'IsNumberLength', async: false })
export class IsNumberLength implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const length = args.constraints[0];
    // Array.from(propertyValue).every()
    const isDigits = /[0-9]/g.test(propertyValue);
    return isDigits && propertyValue.length === length;
  }

  defaultMessage({ value }: ValidationArguments) {
    return `${value} is not long enough`;
  }
}

@ValidatorConstraint({ name: 'IsFullName', async: false })
export class IsFullName implements ValidatorConstraintInterface {
  validate(propertyValue: string) {
    return propertyValue.trim().split(/\s+/g).filter(Boolean).length >= 2;
  }

  defaultMessage({ value }: ValidationArguments) {
    return `${value} is not a full name`;
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

// const PASSWORD_POLICY_REGEXP =
//   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,}$/;
//
// @ValidatorConstraint({ name: 'IsPasswordPolicyOk', async: false })
// export class IsPasswordPolicyOk implements ValidatorConstraintInterface {
//   validate(text: string) {
//     if (PASSWORD_POLICY_REGEXP.test(text)) {
//       const isDumb = dumbPasswords.check(text);
//       return !isDumb;
//     }
//     return false;
//   }
//
//   defaultMessage({ value }: ValidationArguments) {
//     return 'Password does not follow policy';
//   }
// }

// export function IsNullable(validationOptions?: ValidationOptions) {
//   return ValidateIf((_object, value) => value !== null, validationOptions);
// }
//
// export function IsOptionalButNotNull(validationOptions?: ValidationOptions) {
//   return ValidateIf((_object, value) => value !== undefined, validationOptions);
// }

// export function IsInnerHTMLTextLengthNotLongerThan(
//   maxLength: number,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: 'isInnerHTMLTextLengthNotLongerThan',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [maxLength],
//       options: {
//         ...validationOptions,
//         message: `Inner text content is too long. Should not exceed ${maxLength} characters`,
//       },
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           const [maxLength] = args.constraints;
//
//           return (
//             typeof value === 'string' &&
//             sanitizeString(value).replace(/(<([^>]+)>)/gi, '').length <=
//               maxLength
//           );
//         },
//       },
//     });
//   };
// }
//
// /**
//  * Mark the property as optional if the function returns truthy
//  */
// export function IsOptionalIf(
//   allowOptional: (obj: any, value: any) => boolean,
//   options?: ValidationOptions,
// ) {
//   // If required, do validate. Otherwise if null|undefined, don't validate
//   return ValidateIf(
//     (obj, value) => !allowOptional(obj, value) || value != null,
//     options,
//   );
// }

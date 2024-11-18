import { Injectable, PipeTransform } from '@nestjs/common';

function validateNumber(value: any) {
  if (typeof value === 'number') return value;
  return parseInt(value, 10);
}

@Injectable()
export class ParseQueryObjectIntPipe implements PipeTransform<any, number> {
  fields: Array<string>;

  constructor(fields) {
    this.fields = fields;
  }
  transform(values: any): number {
    const transformed = values;

    this.fields.forEach((f) => {
      const field = transformed[f];
      if (field) {
        let result;
        if (Array.isArray(field)) {
          result = field.map(validateNumber);
        } else {
          result = validateNumber(field);
        }
        transformed[f] = result;
      }
    });
    return transformed;
  }
}

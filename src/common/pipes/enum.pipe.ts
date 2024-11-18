import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseEnumPipe<T> implements PipeTransform<any, T> {
  transform(value: any): T {
    return value as T;
  }
}

type StandardEnum<T> = {
  [id: string]: T | string;
  [nu: number]: string;
};

@Injectable()
export class ParseQueryEnumsArrayPipe<T> implements PipeTransform<any, T[]> {
  constructor(
    private fieldsToParse: {
      fields: Array<string>;
      enumToApply: StandardEnum<T>;
    },
  ) {}

  transform(queryValues: any) {
    const { fields, enumToApply } = this.fieldsToParse;

    fields.forEach((value) => {
      const field = queryValues[value];
      if (field) {
        queryValues[value] = field.split(',').filter((f) => enumToApply[f]);
      }
    });

    return queryValues;
  }
}

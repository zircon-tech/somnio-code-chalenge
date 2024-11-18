// import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
// import { parseISO } from 'date-fns';
// import { sanitizeString } from './format';

const valueToBoolean = (value: any) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return undefined;
};

export const ToBoolean = () =>
  Transform(
    ({ value }) => {
      return valueToBoolean(value);
    },
    {
      toClassOnly: true,
    },
  );

export const ToInteger = () =>
  Transform(
    ({ value }) => {
      const tt = Number.parseInt(value, 10);
      if (Number.isNaN(tt)) return null;
      return tt;
    },
    {
      toClassOnly: true,
    },
  );

export const ToFloat = () =>
  Transform(
    ({ value }) => {
      const tt = Number.parseFloat(value);
      if (Number.isNaN(tt)) return null;
      return tt;
    },
    {
      toClassOnly: true,
    },
  );

export const ToSort = () =>
  Transform(
    ({ value }) => {
      const [by, order] = valueToSort(value);
      return { by, order };
    },
    {
      toClassOnly: true,
    },
  );

const valueToSort = (value: any) => {
  if ([undefined, null].includes(value)) {
    return [undefined, undefined];
  }
  const aux: [string?, string?] = value.split(':');
  const key = aux[0];
  const order = aux?.[1]?.toLowerCase();
  if (!order || !key) {
    return [undefined, undefined];
  }
  if (['asc', 'ascending', '1'].includes(order)) return [key, 1];
  if (['desc', 'descending', '-1'].includes(order)) return [key, -1];
  return [undefined, undefined];
};

export const ToArray = () =>
  Transform(
    ({ value }) => {
      return valueToArray(value);
    },
    {
      toClassOnly: true,
    },
  );

const valueToArray = (value: any) => {
  if ([undefined, null, ''].includes(value)) {
    return [];
  }
  if (typeof value === 'string') {
    return value.split(',').map((vv) => vv.trim());
  } else if (typeof value === 'object') {
    return value;
  }
  return [];
};

export const FromDate = (options?) =>
  Transform(
    ({ value }) => {
      return value;
    },
    {
      ...options,
      toPlainOnly: true,
    },
  );

export const ToDate = (options?) =>
  Transform(
    ({ value }) =>
      value instanceof Date ? parseISO(value.toISOString()) : parseISO(value),
    {
      ...options,
      toClassOnly: true,
    },
  );

export const FromDefault = <T = any>(
  defaultValue: T,
  emptyValues: any[] = [undefined],
) =>
  Transform(
    ({ value }) => {
      return emptyValues.includes(value) ? defaultValue : value;
    },
    {
      toPlainOnly: true,
    },
  );

export const ToDefault = <T = any>(
  defaultValue: T,
  emptyValues: any[] = [undefined],
) =>
  Transform(
    ({ value }) => {
      return emptyValues.includes(value) ? defaultValue : value;
    },
    {
      toClassOnly: true,
    },
  );

export const ToLowerCase = () =>
  Transform(({ value }) => value && value.toLowerCase());

export const FromDecimal = () =>
  Transform(
    ({ value }) => {
      return value.toFixed(2);
    },
    {
      toPlainOnly: true,
    },
  );

// export const ToDecimal = () =>
//   Transform(
//     ({ value }) => {
//       return new Prisma.Decimal(value);
//     },
//     {
//       toClassOnly: true,
//     },
//   );

export const ToEnum = (enumEntity: object) =>
  Transform(
    ({ value }) => {
      // const enumValues = Object.keys(enumEntity).map(k => enumEntity[k]);
      // return enumValues.includes(value);
      // return enumEntity[target];
      return value !== null
        ? enumEntity[value as keyof typeof enumEntity]
        : null;
    },
    {
      toClassOnly: true,
    },
  );

export const ToJson = () => {
  const toPlain = Transform(({ value }) => value, {
    toPlainOnly: true,
  });
  const toClass = Transform(
    ({ value }) => {
      return JSON.parse(value);
    },
    {
      toClassOnly: true,
    },
  );
  return (target: any, key: string) => {
    toPlain(target, key);
    toClass(target, key);
  };
};

export const TransformEmptyToMissing = () => {
  const toPlain = Transform(({ value }) => value, {
    toPlainOnly: true,
  });
  const toClass = Transform(({ value }) => (value.length ? value : undefined), {
    toClassOnly: true,
  });
  return (target: any, key: string) => {
    toPlain(target, key);
    toClass(target, key);
  };
};

// export function SanitizeHtmlContent() {
//   return Transform(({ value }) => {
//     return value !== null ? sanitizeString(value) : null;
//   });
// }

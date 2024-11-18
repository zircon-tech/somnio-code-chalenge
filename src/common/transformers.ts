import { Transform } from 'class-transformer';

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

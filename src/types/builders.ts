
export type JsonEncodeAble =
  | { [key: string]: JsonEncodeAble }
  | JsonEncodeAble[]
  | null
  | string
  | boolean
  | number;

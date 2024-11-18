// type aa<K extends string | number | symbol, V> = Record<K, V>;
// type ReadonlyRecord<K extends ReadonlyArray<string | number | symbol>, V> = {readonly ItemOf<K>: V};
// let a: ReadonlyRecord<['a', 'b'], string> = {a: 1, b: 2};

// export type ObjectKeys<T extends object> = `${Exclude<keyof T, symbol>}`;
// export const objectKeys = Object.keys as <Type extends object>(
//   value: Type,
// ) => Array<ObjectKeys<Type>>;
//
// // declare const BetterObject: {
// //   keys<T extends {}>(object: T): (keyof T)[]
// // }
// // const icons = BetterObject.keys({a: 1, b: 2});
//
// export type SkipAfterSecond<T> = T extends [any, any, ...infer T] ? T : never;
// export type SkipLast<T> = T extends [...infer T, any] ? T : never;
//
// // export type Nullable<T extends Record<string, any>> = {
// //   [K in keyof T]-?: T[K] extends Array<infer Item>
// //     ? Array<Nullable<Item>>
// //     : Exclude<T[K], undefined> | null;
// // };
// // export type OnlyDefined<T extends Record<string, any>> = {
// //   [K in keyof T]-?: T[K] extends Array<infer Item>
// //     ? Array<OnlyDefined<Item>>
// //     : Exclude<T[K], undefined>;
// // };
// // export function removeUndefinedDeep<T extends Record<string, any>>(
// //   inp: T,
// // ): OnlyDefined<T> {
// //   return Object.fromEntries(
// //     Object.entries(inp).filter(([, vv]) => vv !== undefined),
// //   ) as OnlyDefined<T>;
// // }
// // export function remapMissingAndUndefinedToNull<T extends Record<string, any>>(
// //   inp: T,
// // ): Nullable<T> {
// //   return Object.fromEntries(
// //     Object.entries(inp).map(([kk, vv]) => [kk, vv === undefined ? null : vv]),
// //   ) as Nullable<T>;
// // }
//
// export type UndefinedAsNull<T extends Record<string, any>> = {
//   [K in keyof T]-?: undefined extends T[K]
//     ? Exclude<T[K], undefined> | null
//     : T[K];
// };
//
// export type Nullable<T extends Record<string, any>> = {
//   [K in keyof T]-?: T[K] extends Array<infer Item>
//     ? Array<Nullable<Item>>
//     : Exclude<T[K], undefined> | null;
// };
//
// export type OnlyDefined<T extends Record<string, any>> = {
//   [K in keyof T]-?: T[K] extends Array<infer Item>
//     ? Array<OnlyDefined<Item>>
//     : Exclude<T[K], undefined>;
// };
//
// export type Defined<T extends Record<string, any>> = {
//   [K in keyof T]-?: Exclude<T[K], undefined>;
// };
//
// export type ItemOf<T> =
//   T extends Array<infer S> ? S : T extends ReadonlyArray<infer G> ? G : never;
// export type ItemOfMutable<T> = T extends Array<infer T> ? T : never;
//
// export type StartingWith<
//   Set,
//   Needle extends string,
// > = Set extends `${Needle}${infer _X}` ? Set : never;

export type JsonEncodeAble =
  | { [key: string]: JsonEncodeAble }
  | JsonEncodeAble[]
  | null
  | string
  | boolean
  | number;

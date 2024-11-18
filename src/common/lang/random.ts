// import * as baseX from 'base-x';
// import * as crypto from 'crypto';
// import * as seedrandom from 'seedrandom';
// import { v4 as uuidv4 } from 'uuid';
// // import * as bcrypt from 'bcrypt';
// // import { authenticator } from 'otplib';
//
// export type Rng = () => Uint8Array;
//
// export function rngFactory(bytesSize: number, seed?: string): Rng {
//   if (seed === undefined) {
//     return () => {
//       const buffer = crypto.randomBytes(bytesSize);
//       return new Uint8Array(buffer);
//     };
//   } else {
//     const rngFloat = seedrandom(seed);
//     return () => {
//       const buffer = Buffer.concat(
//         new Array(bytesSize * 2).fill(null).map(() => {
//           const bb = Buffer.alloc(4);
//           bb.writeFloatLE(rngFloat());
//           return bb;
//         }),
//         bytesSize * 8,
//       );
//       return new Uint8Array(buffer);
//     };
//   }
// }
//
// export function getChildRng(bytesSize: number, parent: Rng): Rng {
//   return rngFactory(bytesSize, randUInt(parent).toString(10));
// }
//
// export function shuffle(rng: Rng, arr: Array<any>) {
//   return arr
//     .map((ee) => [ee, randUIntMax(rng, arr.length)])
//     .sort(([, s1], [, s2]) => s1 - s2)
//     .map(([ee]) => ee);
// }
//
// export function randPick<T>(rng, arr: T[]) {
//   return arr[randUIntMax(rng, arr.length)];
// }
//
// export function randUIntMax(rng: Rng, max: number) {
//   return randUInt(rng) % max;
// }
//
// export function randUIntMinMax(rng, min: number, max: number) {
//   return min + randUIntMax(rng, max - min);
// }
//
// export function randUInt(rng: Rng): number {
//   // ToDo: Assert that max is less than representable by 6 bytes (all ints on JS should take that)
//   return Buffer.from(rng()).readUIntBE(0, 6);
// }
//
// function asciiTablePortion(startCh: string, endCh: string): string[] {
//   const startCode = startCh.charCodeAt(0);
//   const endCode = endCh.charCodeAt(0);
//   return new Array(endCode - startCode + 1)
//     .fill(null)
//     .map((_, idx) => String.fromCharCode(idx + startCode));
// }
//
// const alphaUpperTable = asciiTablePortion('A', 'Z');
// const alphaLowerTable = asciiTablePortion('a', 'z');
// const numericTable = asciiTablePortion('0', '9');
// const alphaNumericTable = [
//   ...alphaUpperTable,
//   ...alphaLowerTable,
//   ...numericTable,
// ];
// const alphaNumericEncoder = baseX(alphaNumericTable.join(''));
//
// export function randomAlphaNumeric(rng: Rng): string {
//   return alphaNumericEncoder.encode(rng());
// }
//
// const alphaLowerEncoder = baseX(alphaLowerTable.join(''));
// export function encodeToLowerAlpha(value: Uint8Array): string {
//   return alphaNumericEncoder.encode(value);
// }
//
// const numericEncoder = baseX(numericTable.join(''));
// export function randomNumeric(rng: Rng): string {
//   return numericEncoder.encode(rng());
// }
//
// export function uuidV4(): string {
//   //   if (someseed) {
//   //     return uuidv4Internal({ rng: rngIds });
//   //   } else {
//   //     return uuidv4Internal();
//   //   }
//   return uuidv4();
// }

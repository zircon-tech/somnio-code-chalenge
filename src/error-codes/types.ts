import type { AppErrorCode, BaseLogicError } from './codes';

export type BaseLogicErrorClassType = new (...args: any[]) => BaseLogicError;

export type ErrorMap = Map<BaseLogicErrorClassType, AppErrorCode>;

import { AppErrorCodes } from "./error-codes";

export class Exception {
  message!: string;
  statusCode!: number;
  code!: string;
  args?: any;

  constructor(message: string, statusCode: number, code: string, args?: any) {
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.args = args;
  }

  static setErrors(feature: string, code: string, error: Exception) {
    errorRegistry.set(feature, code, error);
  }

  static get({
    feature,
    code,
    customMessage,
    args,
  }: {
    feature: AppErrorCodes;
    code: string;
    customMessage?: string;
    args?: any;
  }): Exception {
    let exception = errorRegistry.get({
      code: code,
      feature: feature,
      args: args,
      customMessage: customMessage,
    }) as Exception;
    if (customMessage) {
      exception.message = customMessage;
    }
    if (args) {
      exception.args = args;
    }
    return new Exception(
      exception.message,
      exception.statusCode,
      feature + code,
      exception.args
    );
  }

  static getErrors(): Exception[] {
    return Array.from(errorRegistry.getErrors().values());
  }
}

// util
class ErrorRegistry {
  private table = new Map<string, Exception>();

  set(feature: string, code: string, error: Exception) {
    error.code = feature + code;
    this.table.set(feature + code, error);
  }
  get({
    feature,
    code,
    customMessage,
    args,
  }: {
    feature: AppErrorCodes;
    code: string;
    customMessage?: string | any;
    args?: any;
  }): Exception {
    let exception = this.table.get(feature + code) as Exception;
    if (customMessage) {
      exception.message = customMessage;
    }
    if (args) {
      exception.args = args;
    }
    return new Exception(
      exception.message,
      exception.statusCode,
      feature + code,
      exception.args
    );
  }

  getErrors(): Map<string, Exception> {
    return this.table;
  }
}

const errorRegistry = new ErrorRegistry();

export function buildError(code: string, errors: Exception[]): void {
  errors.forEach((e) => errorRegistry.set(code, e.code, e));
}

import {AppErrorCodes} from "./error-codes";

export class Exception {
    message!: string;
    statusCode!: number;
    code!: string;
    args?: any;
    public appError? = true;
    private static table = new Map<string, Exception>();


    constructor(message: string, statusCode: number, code: string, args?: any) {
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.args = args;
        this.appError = true;
    }

    static setErrors(feature: string, errors: Exception[]) {
        errors.forEach((e) => {
            this.table.set(feature + e.code, {
                code: feature + e.code,
                message: e.message,
                statusCode: e.statusCode,
                args: e.args,
            })
        });
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
        let exception = this.table.get(feature + code) as Exception;
        return new Exception(
            customMessage || exception.message,
            exception.statusCode,
            feature + code,
            args || exception.args
        );
    }

    static getErrors(): Exception[] {
        return Array.from(this.table.values());
    }
}
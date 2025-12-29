class ErrorRecord {
    table!: Map<string, Exception[]>;

    constructor() {
        this.table = new Map<string, Exception[]>();
    }

    getErrorsMap() {
        return this.table;
    }

    addErrors(code: string, error: Exception[]) {
        this.table.set(code, error.map(e => ({...e, appError: undefined})));
    }

    // getErrorsAsList() {
    //     return Array.from(this.table.values()).flat();
    // }
}

let errorRecord = new ErrorRecord();


export class Exception {
    message!: string;
    statusCode!: number;
    code!: string;
    args?: any;
    public appError?: boolean | undefined = true;


    constructor(message: string, statusCode: number, code: string, args?: any) {
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.args = args;
        this.appError = true;
    }

    static getErrorsAsMap() {
        return errorRecord.getErrorsMap();
    }

    static addErrors(code: string, error: Exception[]) {
        errorRecord.addErrors(code, error);
    }
}

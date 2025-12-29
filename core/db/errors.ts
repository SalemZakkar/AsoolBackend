import {Exception} from "../errors";

export class DBDuplicationError extends Exception {
    constructor(args?: any) {
        super("Duplication Conflict", 409, "DB_Duplication", args);
    }
}

export class DBCastError extends Exception {
    constructor(args?: any) {
        super("Database Cast Error", 400, "DB_Cast_Error", args);
    }
}

Exception.addErrors("DB" , [
    new DBDuplicationError(),
    new DBCastError(),
])
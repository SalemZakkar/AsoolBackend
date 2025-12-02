import {AppErrorCodes, Exception} from "../errors";

export enum DatabaseErrors {
    Duplication = "01",
    CastError = "02",
}

Exception.setErrors(AppErrorCodes.database, [
    {
        code: DatabaseErrors.Duplication,
        message: "Duplication Conflict",
        statusCode: 409,
    },
    {
        code: DatabaseErrors.CastError,
        message: "Cast Error",
        statusCode: 400,
    },
]);

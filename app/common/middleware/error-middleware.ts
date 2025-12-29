import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {
    DBCastError, DBDuplicationError,
    Exception,
    SystemJsonError
} from "../../../core";
import {FirebaseTokenExpiredError, FirebaseWrongTokenError} from "../../firebase";
import { FileNotAllowedError } from "../../files";

export function errorMiddleWare(
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let error: Exception | null = (err as any).appError ? {
        code: (err as any).code,
        message: (err as any).message,
        statusCode: (err as any).statusCode,
        args: (err as any).args
    } : null;
    if ((err as any).type == 'entity.parse.failed') {
        error = new SystemJsonError();
    }
    if (err.name === 'MongoServerError') {
        if ((err as any).code == 11000) {
            error = new DBDuplicationError((err as any).keyValue);
        }
    }
    if (err.name == "CastError") {
        error = new DBCastError((err as any).value);
    }
    if ((err as any).code == "auth/argument-error") {
        error = new FirebaseWrongTokenError();
    }
    if ((err as any).code == "auth/id-token-expired") {
        error = new FirebaseTokenExpiredError();
    }
    if ((err as any).code == "LIMIT_UNEXPECTED_FILE") {
        error = new FileNotAllowedError();
    }
    if (error) {
        res.status(error.statusCode).json({code: error.code, message: error.message, args: error.args});
        return;
    }
    console.error(err.name);

    console.error(err);
    res.status(500).json({message: "Internal Server Error."});
}
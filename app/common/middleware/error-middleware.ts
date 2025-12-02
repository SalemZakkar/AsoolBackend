import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {AppErrorCodes, DatabaseErrors, Exception, FileErrors, SystemErrors} from "../../../core";
import {FirebaseErrors} from "../../firebase";

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
        error = Exception.get({
            feature: AppErrorCodes.system,
            code: SystemErrors.JsonParseError,
        });
    }
    if (err.name === 'MongoServerError') {
        if ((err as any).code == 11000) {
            error = Exception.get({
                feature: AppErrorCodes.database,
                code: DatabaseErrors.Duplication,
                args: (err as any).keyValue
            });
        }
    }
    if (err.name == "CastError") {
        error = Exception.get({
            feature: AppErrorCodes.database,
            code: DatabaseErrors.CastError,
            args: (err as any).value
        });
    }
    if ((err as any).code == "auth/argument-error") {
        error = Exception.get({
            feature: AppErrorCodes.firebase,
            code: FirebaseErrors.WrongToken,
        });
    }
    if ((err as any).code == "auth/id-token-expired") {
        error = Exception.get({
            feature: AppErrorCodes.firebase,
            code: FirebaseErrors.TokenExpired,
        });
    }
    if ((err as any).code == "LIMIT_UNEXPECTED_FILE") {
        error = Exception.get({
            feature: AppErrorCodes.file,
            code: FileErrors.NotAllowed,
            args: (err as any).field
        });
    }
    if (error) {
        res.status(error.statusCode).json({code: error.code, message: error.message, args: error.args});
        return;
    }
    console.error(err.name);

    console.error(err);
    res.status(500).json({message: "Internal Server Error."});

    // if (err instanceof Exception) {
    //     error = err;
    //     res
    //         .status(error.statusCode)
    //         .json({code: error.code, message: error.message, args: error.args});
    // } else if ((err as any).type == "entity.parse.failed") {
    //
    //     res
    //         .status(error.statusCode)
    //         .json({code: error.code, message: error.message, args: error.args});
    // } else if ((err as any).code == 11000) {
    //     error = Exception.get({
    //         code: DatabaseErrors.Duplication,
    //         feature: AppErrorCodes.database,
    //         args: (err as any).keyValue,
    //     });
    //     res
    //         .status(error.statusCode)
    //         .json({code: error.code, message: error.message, args: error.args});
    // } else if (err instanceof mongoose.Error) {
    //     if (err.name == "CastError") {
    //         error = Exception.get({
    //             feature: AppErrorCodes.database,
    //             code: DatabaseErrors.CastError,
    //         });
    //         res
    //             .status(error.statusCode)
    //             .json({code: error.code, message: error.message,});
    //         return;
    //     }
    // } else {
    //     console.log(err)
    //     res.status(500).json({message: "Internal Server Error."});
    // }
}
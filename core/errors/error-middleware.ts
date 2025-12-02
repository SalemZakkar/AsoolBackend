import {Response} from "express";
import {AppErrorCodes, Exception, SystemErrors} from ".";

export function getAppErrorsApi(
    res: Response,
) {
    res.status(200).json({data: Exception.getErrors()});
}

export function notFoundHandler() {
    throw Exception.get({
        feature: AppErrorCodes.system,
        code: SystemErrors.NotFound,
    });
}

import express from "express";
import {SystemNotFoundError} from "./system-errors";
import {Exception} from "./exception";

export function getAppErrorsApi(
    req: express.Request,
    res: express.Response,
) {
    const responseData = Object.fromEntries(Exception.getErrorsAsMap());
    res.status(200).json(responseData);
}

export function notFoundHandler() {
    throw new SystemNotFoundError();
}

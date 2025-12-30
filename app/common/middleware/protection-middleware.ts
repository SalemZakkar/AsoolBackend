import {NextFunction, Request, Response} from "express";
import {decodeToken,} from "../../../core";
import {AuthUnAuthError} from "../../auth/errors";
import mongoose from "mongoose";

export const protection = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        throw new AuthUnAuthError();
    }
    const parts = authHeader!.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new AuthUnAuthError();

    }
    const token = parts[1];
    let decoded = decodeToken(token ?? "");
    if (decoded.hasError) {
        throw new AuthUnAuthError();
    }
    let user = await mongoose.model("User").findById(decoded.data.userId);
    if(!user){
        throw new AuthUnAuthError();
    }
    req.userId = user.id;
    req.user = user;
    next();
};

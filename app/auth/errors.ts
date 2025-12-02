import {AppErrorCodes, Exception} from "../../core";

export enum AuthErrors {
    InvalidCredentials = "01",
    PasswordMismatch = "02",
    UnAuth = "03",
    JwtExpired = "04",
    RefreshTokenWrong = "05",
    RefreshTokenExpired = "06",
}

Exception.setErrors(AppErrorCodes.auth, [
    {
        code: AuthErrors.InvalidCredentials,
        message: "Invalid email or password",
        statusCode: 400,
    },
    {
        code: AuthErrors.PasswordMismatch,
        message: "passwords are not same.",
        statusCode: 400,
    },
    {
        code: AuthErrors.UnAuth,
        message: "UnAuthenticated.",
        statusCode: 401,
    },
    {
        code: AuthErrors.JwtExpired,
        message: "Token Expired.",
        statusCode: 419,
    },
    {
        code: AuthErrors.RefreshTokenWrong,
        message: "Wrong RefreshToken.",
        statusCode: 400,
    },
    {
        code: AuthErrors.RefreshTokenExpired,
        message: "RefreshToken Expired.",
        statusCode: 419,
    },
]);

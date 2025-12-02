import {AppErrorCodes, Exception} from "../../core";

export enum FirebaseErrors {
    WrongToken = "01",
    TokenExpired = "02"
}

Exception.setErrors(AppErrorCodes.firebase, [
    {
        code: FirebaseErrors.WrongToken,
        message: "Firebase Token Wrong",
        statusCode: 400
    },
    {
        code: FirebaseErrors.TokenExpired,
        message: "Firebase Token Expired",
        statusCode: 419
    },
])


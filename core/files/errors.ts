import {AppErrorCodes, Exception} from "../errors";

export enum FileErrors {
    WriteError = "01",
    NotFoundError = "02",
    NoFile = "03",
    NotAllowed = "04"
}

Exception.setErrors(AppErrorCodes.file , [
    {
        code: FileErrors.WriteError,
        message: "Error Writing File",
        statusCode: 400
    },
    {
        code: FileErrors.NotFoundError,
        message: "File Not Found",
        statusCode: 404
    },
    {
        code: FileErrors.NoFile,
        message: "No File",
        statusCode: 400
    },
    {
        code: FileErrors.NotAllowed,
        message: "File Not Allowed",
        statusCode: 400
    }
]);
import { AppErrorCodes, buildError } from "../errors";

export enum DatabaseErrors {
  Duplication = "01",
}

buildError(AppErrorCodes.database, [
  {
    code: DatabaseErrors.Duplication,
    message: "Dupplication Conflict",
    statusCode: 409,
  },
]);

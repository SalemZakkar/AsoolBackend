import { IUser } from "../models";

declare global {
  namespace Express {
    interface Request {
      userId:
        | string
        | import("mongoose").ObjectId
        | null;
      user: IUser | null | undefined;
      language: string
    }
  }
}

export {};

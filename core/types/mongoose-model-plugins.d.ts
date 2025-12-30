import "mongoose";
import { MongooseQuery } from "../db";

declare module "mongoose" {
  interface Model<
    T = {},
    TQueryHelpers = {},
    TMethods = {},
    TVirtuals = {},
    TSchema = any
  > {
    findAndCount(params: MongooseQuery): Promise<{ total: number; data: T[] }>;

    findByIdIfExists(params: any);

    deleteIfExists(params: any, session: ClientSession | null = null);

    updateByIdIfExists(
      id: string | import("mongoose").ObjectId,
      params: any,
      options: QueryOptions | null = null
    );
  }
}

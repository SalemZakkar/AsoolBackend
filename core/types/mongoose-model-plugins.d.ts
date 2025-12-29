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
        findAndCount(
            params: MongooseQuery
        ): Promise<{ total: number; data: T[] }>;
    }
}
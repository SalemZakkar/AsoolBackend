import mongoose, { ClientSession, QueryOptions } from "mongoose";
import { MongooseQuery } from "./mongoose-queries-util";
import { DBNotFoundError } from "./errors";
import { MongoId } from "./utils";

export const findAndCount = function (schema: mongoose.Schema, options: any) {
  schema.statics.findAndCount = async function findAndCount(
    params: MongooseQuery,
    projection: any = undefined
  ) {
    let queries = [];
    if (params.total) {
      queries.push(this.countDocuments(params.conditions));
    } else {
      queries.push(undefined);
    }
    if (params.data) {
      queries.push(
        this.find(params.conditions ?? {}, projection)
          .sort(params.sort)
          .skip(params.skip)
          .limit(params.limit)
      );
    } else {
      queries.push(undefined);
    }
    let [total, data] = await Promise.all(queries);

    return { total, data };
  };

  schema.statics.findByIdIfExists = async function findIfExists(params: any) {
    let res = await this.findById(params);
    if (!res) {
      throw new DBNotFoundError();
    }
    return res;
  };

  schema.statics.updateByIdIfExists = async function updateByIdIfExists(
    id: MongoId,
    params: any,
    options: QueryOptions | null = null
  ) {
    let res = await this.findById(id);
    if (!res) {
      throw new DBNotFoundError();
    }
    return this.findByIdAndUpdate(id, params, options);
  };

  schema.statics.deleteIfExists = async function findIfExists(
    params: any,
    session: ClientSession | null = null
  ) {
    let res = await this.exists({ _id: params });
    if (!res) {
      throw new DBNotFoundError();
    }
    await this.findByIdAndDelete(params, { session: session });
  };
};

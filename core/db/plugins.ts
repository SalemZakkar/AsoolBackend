import mongoose, { DefaultSchemaOptions, ResolveSchemaOptions } from "mongoose";
import { MongooseQuery } from "./mongoose-queries-util";

export const findAndCount = function (schema: mongoose.Schema, options: any) {
  schema.statics.findAndCount = async function findAndCount(
    params: MongooseQuery
  ) {
    let queries = [];
    if (params.total) {
      queries.push(
        this.countDocuments(params.conditions, { session: options })
      );
    } else {
      queries.push(undefined);
    }
    if (params.data) {
      queries.push(
        this.find(params.conditions ?? {})
          .skip(params.skip)
          .limit(params.limit)
      );
    } else {
      queries.push(undefined);
    }
    let [total, data] = await Promise.all(queries);

    
    return { total, data };
  };
};

import mongoose, { SchemaOptions } from "mongoose";

export function initDB() {
  mongoose.connect(process.env.DBURL!).then(() => {
    console.log("Connected To DB");
  });
}

interface Params {
  hideToJson?: string[];
  options?: SchemaOptions;
}

export function defaultDbOptions(
  {
    hideToJson = [],
    options = { virtuals: false, versionKey: false },
  }: Params = {
    options: { virtuals: false, versionKey: false },
  }
) {
  return {
    ...options,
    toJSON: {
      transform: (doc, ret) => {
        let finalObject;
        if (ret._id) {
          let id = ret._id;
          finalObject = { id, ...ret };
          delete (finalObject as any)._id;
        } else {
          finalObject = ret;
        }
        hideToJson.forEach((e) => {
          if (e in finalObject) {
            delete (finalObject as any)[e];
          }
        });
        return finalObject;
      },
    },
  } as SchemaOptions<any>;
}

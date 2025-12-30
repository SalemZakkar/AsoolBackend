import mongoose, { model, Schema } from "mongoose";
import { Category } from "./interface";
import { defaultDbOptions } from "../../../core";

let schema = new Schema<Category>(
  {
    image: {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
    name: {
      type: String,
      req: true,
    },
  },
  defaultDbOptions()
);

export const CategoryModel = model<Category>("Category", schema);

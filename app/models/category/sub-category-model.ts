import mongoose, { model, Schema } from "mongoose";
import { SubCategory } from "./interface";
import { defaultDbOptions } from "../../../core";

let schema = new Schema<SubCategory>(
  {
    image: {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
    name: {
      type: String,
      req: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  },
  defaultDbOptions()
);

export const SubCategoryModel = model<SubCategory>("SubCategory", schema);

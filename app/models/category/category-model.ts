import mongoose, { model, Schema } from "mongoose";
import { Category } from "./interface";
import { defaultDbOptions } from "../../../core";
import { LocalizationSchema } from "../common/localization-schema";

let schema = new Schema<Category>(
  {
    image: {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
    name: LocalizationSchema,
  },
  defaultDbOptions()
);

export const CategoryModel = model<Category>("Category", schema);

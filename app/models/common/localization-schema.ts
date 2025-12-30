import { Schema } from "mongoose";
import { LocalizedString } from "./interface";

export const LocalizationSchema = new Schema<LocalizedString>(
  {
    ar: { type: String },
    en: { type: String, required: true },
  },
  { _id: false, virtuals: false }
);

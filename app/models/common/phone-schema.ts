import { Schema } from "mongoose";
import { LocalizedString, PhoneNumber } from "./interface";

export const PhoneSchema = new Schema<PhoneNumber>(
  {
    phone: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  { _id: false, virtuals: false }
);

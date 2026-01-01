import mongoose, { model, Schema } from "mongoose";
import { Store } from "./interface";
import { AddressSchema } from "../common/address-schema";
import { PhoneSchema } from "../common/phone-schema";
import { LocalizationSchema } from "../common/localization-schema";
import { defaultDbOptions } from "../../../core";

let schema = new Schema<Store>(
  {
    address: AddressSchema,
    categories: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Category",
      },
    ],
    phone: PhoneSchema,
    name: LocalizationSchema,
    image: {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  defaultDbOptions()
);

schema.pre("find", function (next) {
  this.populate("categories");
  next();
});

schema.post(["save", "findOneAndUpdate"], async function (doc) {
  await doc.populate("categories");
});

export const StoreModel = model<Store>("Store", schema);

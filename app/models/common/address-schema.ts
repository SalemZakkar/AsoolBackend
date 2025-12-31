import { Schema } from "mongoose";
import { Address } from "./interface";
import { LocalizationSchema } from "./localization-schema";

export const AddressSchema = new Schema<Address>(
  {
    address: LocalizationSchema,
    position: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
  { _id: false, virtuals: false }
);

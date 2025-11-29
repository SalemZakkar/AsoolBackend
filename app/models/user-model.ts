import { model, Schema } from "mongoose";
import { defaultDbOptions } from "../../core";
import { IUser, UserRole } from "../user/interface";

let userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: String,
    phone: {
      phone: {
        type: String,
      },
      code: {
        type: String,
      },
    },
    firebaseId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.user,
    },
  },
  defaultDbOptions({
    hideToJson: ["password"],
    options: {
      versionKey: false,
    },
  })
);

export const UserModel = model<IUser>("User", userSchema);

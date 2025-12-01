import mongoose from "mongoose";
import { PhoneNumber } from "../common";

export interface IUser {
  _id?: mongoose.ObjectId;
  name: string;
  phone?: PhoneNumber | undefined;
  email: string;
  password?: string;
  avatar?: string;
  firebaseId?: string;
  isEmailVerified?: boolean;
  role: UserRole
}

export interface UserUpdateFields {
  phone?: PhoneNumber | undefined;
  name?: string;
  avatar?: string;
  email?: string,
  isEmailVerified?: boolean,
}

export enum UserRole {
  user = "User",
  admin = "Admin"
}

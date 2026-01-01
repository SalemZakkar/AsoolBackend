import mongoose from "mongoose";
import { PhoneNumber } from "../common/interface";
import { Ability } from "@casl/ability";

export interface IUser {
  _id?: mongoose.ObjectId;
  name: string;
  phone?: PhoneNumber | undefined;
  email: string;
  password?: string;
  avatar?: string;
  firebaseId?: string;
  isEmailVerified?: boolean;
  role: UserRole;
}

export interface UserUpdateFields {
  phone?: PhoneNumber | undefined;
  name?: string;
  avatar?: any;
  email?: string;
  isEmailVerified?: boolean;
  firebaseId?: string | null;
  password?: string;
}

export enum UserRole {
  user = "User",
  admin = "Admin",
  shop = "Shop-Manager",
}

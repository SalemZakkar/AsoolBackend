import mongoose, { Schema } from "mongoose";

export enum OtpReason {
  ResetPassword = "RESET_PASSWORD",
  VerifyEmail = "VERIFY_EMAIL",
}

export enum OtpChannel {
  Email = "Email",
}

export interface Otp {
  createdAt: Date;
  user: Schema.Types.ObjectId;
  otp: string;
  attempts: number;
  reason: OtpReason;
  _id: mongoose.Types.ObjectId;
}

export interface OtpInstanceFunctions {
  isExpired(): boolean;
  nextTime(): Date;
  canSend(): boolean;


}

export interface OtpResult {
  otp: Otp & OtpInstanceFunctions;
  sent: boolean;
}

import mongoose, { model, Schema } from "mongoose";

export interface ISession {
  accessToken: string;
  refreshToken: string;
  user: Schema.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
}

let sessionSchema = new Schema<ISession>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // optional but you will want it
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

export const SessionModel = model<ISession>("Session", sessionSchema);

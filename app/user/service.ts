import { ClientSession } from "mongoose";
import { IUser, UserUpdateFields } from "./interface";
import { UserModel } from "../models/user-model";

export class UserService {
  createAccount = async (data: IUser) => {
    let res = await UserModel.create(data);
    return res;
  };

  update = async (id: string, data: UserUpdateFields) => {
    let res = await UserModel.findByIdAndUpdate(id, data, { new: true });
    return res;
  };

  updateAvatar = async (id: string, avatar: string, session: ClientSession) => {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { avatar: avatar },
      { session: session, new: true }
    );
    return res;
  };

  deletePhoto = async (id: string, session: ClientSession) => {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { avatar: null },
      { session: session, new: true }
    );
    return res;
  };

  setPassword = async (id: String, password: String) => {
    let res = await UserModel.findByIdAndUpdate(id, { password: password });
    return res;
  };

  setGoogleId = async (id: String, googleId: String) => {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { firebaseId: googleId },
      { new: true }
    );
    return res;
  };

  getUserByEmail = async (email: string) => {
    return UserModel.findOne({ email: email });
  };

  getUserById = async (id: string) => {
    return await UserModel.findById(id);
  };
}

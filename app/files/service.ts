import { AppFile, FileModel } from "./model";
import { FileNotFoundError } from "./errors";
import mongoose from "mongoose";

export class FileService {
  saveFile = async (
    file: Express.Multer.File | null | undefined,
    session: mongoose.ClientSession | null = null
  ) => {
    if (file === null) {
      return null;
    }
    if (file === undefined) {
      return undefined;
    }
    if (Array.isArray(file) && file.length == 0) {
      return undefined;
    }

    const fileData: AppFile = {
      fileName: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
    };
    return await FileModel.insertOne(fileData, { session: session });
  };

  getFileDocument = async (id: string | mongoose.ObjectId) => {
    let doc = await FileModel.findById(id);
    if (!doc) {
      throw new FileNotFoundError();
    }
    return doc;
  };
  getFile = async (id: string | mongoose.ObjectId) => {
    return (await this.getFileDocument(id)).buffer;
  };
  deleteFile = async (
    id?: string | mongoose.ObjectId | mongoose.Types.ObjectId | null,
    session: mongoose.ClientSession | null = null
  ) => {
    if (!id) {
      return;
    }
    await FileModel.findOneAndDelete({ _id: id }, { session: session });
  };

  processSingleFileSwitch = async (
    file: Express.Multer.File | null | undefined,
    old: any,
    session: mongoose.ClientSession | null = null
  ) => {
    if (file === null) {
      await this.deleteFile(old, session);
      return null;
    }
    if (file === undefined) {
      return undefined;
    }

    await this.deleteFile(old, session);
    return (await this.saveFile(file, session))?._id;
  };
}

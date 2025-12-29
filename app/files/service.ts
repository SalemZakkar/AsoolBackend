import {AppFile, FileModel} from "./model";
import {FileNotFoundError} from "./errors";
import mongoose from "mongoose";

export class FileService {
    saveFile = async (file: Express.Multer.File | null | undefined, session: mongoose.ClientSession | null = null) => {
        if (!file) {
            return;
        }
        const fileData: AppFile = {
            fileName: file.originalname,
            mimetype: file.mimetype,
            buffer: file.buffer,
        };
        return await FileModel.insertOne(fileData, {session: session});
    }

    getFileDocument = async (id: string | mongoose.ObjectId) => {
        let doc = await FileModel.findById(id);
        if (!doc) {
            throw new FileNotFoundError();
        }
        return doc;
    }
    getFile = async (id: string | mongoose.ObjectId) => {
        return (await this.getFileDocument(id)).buffer;
    }
    deleteFile = async (id?: string | mongoose.ObjectId | mongoose.Types.ObjectId | null, session: mongoose.ClientSession | null = null) => {
        if (!id) {
            return;
        }
        await FileModel.findOneAndDelete({_id: id}, {session: session});
    }
}
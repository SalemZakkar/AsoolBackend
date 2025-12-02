import path from "path";
import {AppFile, FileModel} from "./model";
import * as fs from "node:fs";
import {v4 as uuidv4} from "uuid";
import {AppErrorCodes, Exception} from "../errors";
import {FileErrors} from "./errors";
import mongoose, {ClientSession} from "mongoose";

export class FileService {
    saveFile = async (file: Express.Multer.File | any, session?: ClientSession) => {
        if (!file) {
            throw Exception.get({feature: AppErrorCodes.file, code: FileErrors.NoFile});
        }
        let name = uuidv4();
        let p = path.join("/uploads/", name);
        fs.writeFileSync(p, file.buffer);
        const fileData: AppFile = {
            fileName: name,
            path: p,
            mimetype: file.mimetype,
        };
        return (await FileModel.insertOne(fileData, {session: session ? session : null}))._id;
    }

    getFile = async (id: string | mongoose.ObjectId) => {
        let doc = await FileModel.findById(id);
        if (!doc) {
            throw Exception.get({feature: AppErrorCodes.file, code: FileErrors.NotFoundError});
        }
        if (!fs.existsSync(doc.path)) {
            throw Exception.get({feature: AppErrorCodes.file, code: FileErrors.NotFoundError});
        }
        return doc;
    }

    deleteFile = async (id: string | mongoose.ObjectId, session?: ClientSession) => {
        let doc = await FileModel.findById(id);
        if (!doc) {
            throw Exception.get({feature: AppErrorCodes.file, code: FileErrors.NotFoundError});
        }
        if (fs.existsSync(doc.path)) {
            fs.unlinkSync(doc.path);
        }
        await FileModel.findOneAndDelete({_id: id}, {session: session ? session : null});
    }


}
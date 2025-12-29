import mongoose, {Schema} from "mongoose";

export interface AppFile {
    fileName: string;
    mimetype: string;
    buffer: Buffer;
}

let fileSchema = new Schema<AppFile>({
    fileName: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    buffer: {
        type: Buffer,
        required: true
    }
});

export const FileModel = mongoose.model("File", fileSchema);
import mongoose, {Schema} from "mongoose";

export interface AppFile {
    fileName: string;
    path: string;
    mimetype: string;
}

let fileSchema = new Schema<AppFile>({
    fileName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
});

export const FileModel = mongoose.model("File", fileSchema);
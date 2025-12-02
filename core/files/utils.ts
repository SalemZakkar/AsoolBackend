
import multer from "multer";
const upload = multer();

export function files(...names: string[]) {
    return upload.fields(
        names.map(name => ({ name }))
    );
}

export function getFileByKey(files: any, key: string): Express.Multer.File[] {
    if (!files) return [];

    if (!Array.isArray(files)) {
        return files[key] || [];
    }

    if (Array.isArray(files)) {
        return files || [];
    }

    return [];
}

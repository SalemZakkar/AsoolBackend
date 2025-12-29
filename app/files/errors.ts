import {Exception} from "../../core";

export class FileNoFileError extends Exception {
    constructor() {
        super("File No File Error", 400, "File_No_File");
    }

}

export class FileNotFoundError extends Exception {
    constructor() {
        super("Error File Not Found", 404, "File_Not_Found");
    }

}

export class FileNotAllowedError extends Exception {
    constructor() {
        super("File Not Allowed", 400, "File_Not_Allowed",);
    }
}

Exception.addErrors("File", [
    new FileNotFoundError(),
    new FileNotAllowedError(),
    new FileNoFileError(),
])
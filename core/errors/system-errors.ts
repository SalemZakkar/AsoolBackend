import {Exception} from "./exception";


export class SystemJsonError extends Exception {
    constructor(args?: any) {
        super("Json Parse Error", 400, "System_Json_Error", args);
    }
}

export class SystemNotFoundError extends Exception {
    constructor(args?: any) {
        super("Not Found", 404, "System_Not_Found", args);
    }
}

Exception.addErrors("System", [
    new SystemNotFoundError(),
    new SystemJsonError(),
]);
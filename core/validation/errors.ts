import {Exception} from "../errors";


export class ValidationWrongInputError extends Exception {
    constructor(args?: any) {
        super("Validation Wrong Input Error", 400, "Validation_Wrong_Input_Error", args);
    }
}

Exception.addErrors("Validation", [
    new ValidationWrongInputError(),
])

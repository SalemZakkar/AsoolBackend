import { Exception } from "../../core";


export class UserAlreadyVerifiedError extends Exception {
  constructor() {
    super("User Already Verified", 400, "User_Already_Verified");
  }
}

export class UserNotFoundError extends Exception {
  constructor() {
    super("User Not Found", 404, "User_Not_Found");
  }
}

Exception.addErrors("USER", [
  new UserAlreadyVerifiedError(),
  new UserNotFoundError(),
]);

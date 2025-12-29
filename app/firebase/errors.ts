import { Exception } from "../../core";


export class FirebaseWrongTokenError extends Exception {
  constructor() {
    super("Firebase Token Wrong", 400, "Firebase_Wrong_Token");
  }
}

export class FirebaseTokenExpiredError extends Exception {
  constructor() {
    super("Firebase Token Expired", 419, "Firebase_Token_Expired");
  }
}

Exception.addErrors("FIREBASE", [
  new FirebaseTokenExpiredError(),
  new FirebaseWrongTokenError(),
]);

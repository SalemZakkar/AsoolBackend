import { Exception } from "../errors";

export class AccessUnAllowedError extends Exception {
  constructor() {
    super("Access Not Allowed", 401, "Access_Not_Allowed");
  }
}

Exception.addErrors("Access", [new AccessUnAllowedError()]);

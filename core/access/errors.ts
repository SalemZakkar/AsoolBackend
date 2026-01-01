import { Exception } from "../errors";

export class AccessUnAllowedError extends Exception {
  constructor(arg: any = undefined) {
    super("Access Not Allowed", 403, "Access_Not_Allowed" , arg);
  }
}

Exception.addErrors("Access", [new AccessUnAllowedError()]);

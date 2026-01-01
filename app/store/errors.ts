import { Exception } from "../../core";

export class StoreUserShouldBeStoreOwnerError extends Exception {
  constructor() {
    super(
      "Store user should be store owner",
      400,
      "Store_User_Should_Be_Store_Owner"
    );
  }
}

Exception.addErrors("Store", [new StoreUserShouldBeStoreOwnerError()]);

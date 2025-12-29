import { Exception } from "../../core";

export class AuthInvalidCredentialsError extends Exception {
  constructor() {
    super("Invalid email or password", 400, "Auth_Invalid_Credentials");
  }
}

export class AuthPasswordMismatchError extends Exception {
  constructor() {
    super("passwords are not same.", 400, "Auth_Password_Mismatch");
  }
}

export class AuthUnAuthError extends Exception {
  constructor() {
    super("UnAuthenticated.", 401, "Auth_Unauthenticated");
  }
}

export class AuthJwtExpiredError extends Exception {
  constructor() {
    super("Token Expired.", 419, "Auth_Jwt_Expired");
  }
}

export class AuthRefreshTokenWrongError extends Exception {
  constructor() {
    super("Wrong RefreshToken.", 400, "Auth_Refresh_Token_Wrong");
  }
}

export class AuthRefreshTokenExpiredError extends Exception {
  constructor() {
    super("RefreshToken Expired.", 419, "Auth_Refresh_Token_Expired");
  }
}

Exception.addErrors("AUTH", [
  new AuthInvalidCredentialsError(),
  new AuthPasswordMismatchError(),
  new AuthUnAuthError(),
  new AuthJwtExpiredError(),
  new AuthRefreshTokenWrongError(),
  new AuthRefreshTokenExpiredError(),
]);

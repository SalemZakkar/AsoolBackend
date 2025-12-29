import { Exception } from "../../core";

export class OtpTooManyAttemptsError extends Exception {
  constructor() {
    super("Too Many Attemps", 429, "Otp_Too_Many_Attempts");
  }
}

export class OtpWrongOtpError extends Exception {
  constructor() {
    super("Otp Code Error", 400, "Otp_Wrong_Code");
  }
}

export class OtpExpiredError extends Exception {
  constructor() {
    super("Otp expired", 400, "Otp_Expired");
  }
}

Exception.addErrors("OTP", [
  new OtpTooManyAttemptsError(),
  new OtpWrongOtpError(),
  new OtpExpiredError(),
]);

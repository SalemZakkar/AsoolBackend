import {Router} from "express";
import {validateJsonBody} from "../../core";
import {authRefreshValidator, authSignInValidator, authSignUpValidator} from "./validator";
import {AuthController} from "./controller";
import {firebaseTokenValidator} from "../common";

let authRouter = Router();

let authController = new AuthController();

authRouter
    .post("/signIn", validateJsonBody(authSignInValidator), authController.signIn)
    .post("/signUp", validateJsonBody(authSignUpValidator), authController.signUp)
    .post("/refreshToken", validateJsonBody(authRefreshValidator), authController.refreshToken)
    .post("/signInFirebase", validateJsonBody(firebaseTokenValidator), authController.signInFirebase);

export {authRouter};

import { Router } from "express";
import { protection } from "../auth/middleware";
import { UserController } from "./controller";
import { validateJsonBody } from "../../core";
import { userUpdateValidator } from "./validator";

let userRouter = Router();

let userController = new UserController();

userRouter.get("/mine", protection, userController.getMine);
userRouter.patch("/:id", protection, validateJsonBody(userUpdateValidator) , userController.updateUser);

export { userRouter };

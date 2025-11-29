import { Router } from "express";
import { authRouter } from "./auth";
import { getAppErrorsApi } from "../core";
import { userRouter } from "./user";

let appRouterV1 = Router();

appRouterV1.use("/auth", authRouter);

appRouterV1.use("/user", userRouter);

appRouterV1.use("/errors", getAppErrorsApi);

export { appRouterV1 };

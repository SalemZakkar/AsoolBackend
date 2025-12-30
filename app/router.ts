import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { getAppErrorsApi } from "../core";
import { fileRouter } from "./files";
import { categoryRouter } from "./category/router";

let appRouterV1 = Router();

appRouterV1.use("/auth", authRouter);

appRouterV1.use("/user", userRouter);

appRouterV1.use("/category", categoryRouter);

appRouterV1.use("/file", fileRouter);

appRouterV1.use("/errors", getAppErrorsApi);

export { appRouterV1 };

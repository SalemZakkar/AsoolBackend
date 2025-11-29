import {  initDB, notFoundHandler } from "./core";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import { errorMiddleWare } from "./core";
import * as qs from "qs";
import { appRouterV1 } from "./app/router";
initDB();
let app = express();

app.set("query parser", (str: string) => qs.parse(str));

app.use(express.json());

app.use("/api/v1", appRouterV1);

app.use(notFoundHandler);

app.use(errorMiddleWare);

app.listen(process.env.PORT, () => {
  console.log("Server is running on 3000");
});

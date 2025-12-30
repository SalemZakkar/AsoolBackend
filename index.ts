require("dotenv").config({ path: "./.env" });
import express from "express";
import qs from "qs";
import { mongoConnect, notFoundHandler } from "./core";
import { appRouterV1 } from "./app/router";
import { errorMiddleWare } from "./app/common";
import { localizationMiddleware } from "./app/common";
require("./app/firebase");
mongoConnect(process.env.DBURL!);
let app = express();

app.use(express.urlencoded({ extended: true }));

app.set("query parser", (str: string) => qs.parse(str));

app.use(express.json());

app.use(localizationMiddleware);

app.use("/api/v1", appRouterV1);

app.use("/ping", (res: express.Response) => {
  res.status(200).json({ message: "Pong" });
});

app.use(notFoundHandler);

app.use(errorMiddleWare);

app.listen(process.env.PORT, () => {
  console.log("Server is running on 3000");
  // let url = "https://asoolbackend.onrender.com/ping";
  // setInterval(async () => {
  //     try {
  //         await fetch("https://asoolbackend.onrender.com/ping");
  //     } catch (err) {
  //         console.error(err);
  //     }
  // }, 30 * 1000)
});

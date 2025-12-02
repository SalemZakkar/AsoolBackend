import dotenv from "dotenv";

dotenv.config({path: "./.env"});
import {mongoConnect, notFoundHandler} from "./core";
import express from "express";
import {errorMiddleWare} from "./app/common";
import qs from "qs";
import {appRouterV1} from "./app/router";
import {Response} from "express";
import * as https from "node:https";

require("./app/firebase");


mongoConnect(process.env.DBURL!);

let app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("query parser", (str: string) => qs.parse(str));

app.use(express.json());

app.use("/api/v1", appRouterV1);

app.use("/ping", (res: Response) => {
    res.status(200).json({message: "Pong"});
});

app.use(notFoundHandler);

app.use(errorMiddleWare);

app.listen(process.env.PORT, () => {
    console.log("Server is running on 3000");
    let url = "https://asoolbackend.onrender.com/ping";
    setInterval(() => {
        let req = https.get(url, () => {
            req.end()
        });
    }, 30 * 1000)
});

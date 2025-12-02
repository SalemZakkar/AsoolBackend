import {Router} from "express";
import {FileController} from "./controller";

let fileRouter = Router();

let fileController = new FileController();

fileRouter.get("/:id", fileController.getFile);

export {fileRouter};
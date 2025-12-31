import { Router } from "express";
import { StoreController } from "./controller";
import {
  localizedFieldsMiddleware,
  permissionMiddleWare,
  protection,
} from "../common";
import { StoreAction } from "./abilities";
import { multerFiles, validateJsonBody, validateJsonQuery } from "../../core";
import { StoreValidator } from "./validator";

let storeRouter = Router();

let controller = new StoreController();
let validator = new StoreValidator();

storeRouter.post(
  "/",
  protection,
  permissionMiddleWare(StoreAction.manage, "store"),
  multerFiles("image"),
  validateJsonBody(validator.create),
  localizedFieldsMiddleware("name"),
  controller.create
);
storeRouter.get(
  "/",
  validateJsonQuery(validator.get),
  controller.getAll
);

storeRouter.patch(
  "/:id",
  protection,
  permissionMiddleWare(StoreAction.manage, "store"),
  multerFiles("image"),
  validateJsonBody(validator.edit),
  localizedFieldsMiddleware("name"),
  controller.edit
);
storeRouter.delete(
  "/:id",
  protection,
  permissionMiddleWare(StoreAction.manage, "store"),
  controller.delete
);

export { storeRouter };

import { Router } from "express";
import { CategoryController } from "./controller";
import { CategoryValidator, SubCategoryValidator } from "./validator";
import { multerFiles, validateJsonBody, validateJsonQuery } from "../../core";
import { permissionMiddleWare, protection } from "../common";
import { CategoryActions } from "./abilities";
import { localizedFieldsMiddleware } from "../common";

let categoryRouter = Router();

let controller = new CategoryController();
let validator = new CategoryValidator();
let subCategoryValidator = new SubCategoryValidator();

categoryRouter.get(
  "/",
  validateJsonQuery(validator.getValidator),
  controller.getAllCategories
);

categoryRouter.post(
  "/",
  protection,
  permissionMiddleWare(CategoryActions.create, "Category"),
  multerFiles("image"),
  validateJsonBody(validator.createValidator),
  localizedFieldsMiddleware("name"),
  controller.createCategory
);

categoryRouter.patch(
  "/:id",
  protection,
  permissionMiddleWare(CategoryActions.edit, "Category"),
  multerFiles("image"),
  validateJsonBody(validator.editValidator),
  localizedFieldsMiddleware("name"),
  controller.editCategory
);

categoryRouter.delete(
  "/:id",
  protection,
  permissionMiddleWare(CategoryActions.delete, "Category"),
  controller.deleteCategory
);

categoryRouter.get(
  "/sub",
  validateJsonQuery(subCategoryValidator.getValidator),
  controller.getAllSubCategories
);

categoryRouter.post(
  "/sub",
  protection,
  permissionMiddleWare(CategoryActions.create, "Category"),
  multerFiles("image"),
  validateJsonBody(subCategoryValidator.createValidator),
  localizedFieldsMiddleware("name"),
  controller.createSubCategory
);

categoryRouter.patch(
  "/sub/:id",
  protection,
  permissionMiddleWare(CategoryActions.edit, "Category"),
  multerFiles("image"),
  validateJsonBody(subCategoryValidator.editValidator),
  localizedFieldsMiddleware("name"),
  controller.editSubCategory
);

categoryRouter.delete(
  "/sub/:id",
  protection,
  permissionMiddleWare(CategoryActions.delete, "Category"),
  controller.deleteSubCategory
);

export { categoryRouter };

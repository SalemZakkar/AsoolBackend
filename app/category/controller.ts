import { Request, Response } from "express";
import {
  getFilesByFieldName,
  getMongooseQueries,
  sendSuccessResponse,
} from "../../core";
import { CategoryService, SubCategoryService } from "./service";
import {
  applyLocalization,
  localizeConditions,
} from "../common/utils/localization";

export class CategoryController {
  service = new CategoryService();
  subCategoryService = new SubCategoryService();
  createCategory = async (req: Request, res: Response) => {
    let file = getFilesByFieldName(req, "image");

    sendSuccessResponse({
      res: res,
      data: await this.service.create({
        name: req.body.name,
        file: file.at(0),
      }),
    });
  };

  editCategory = async (req: Request, res: Response) => {
    let file = getFilesByFieldName(req, "image");
    sendSuccessResponse({
      res: res,
      data: await this.service.edit({
        id: req.params.id,
        name: req.body.name,
        file: file.at(0) || req.body.image,
      }),
    });
  };

  deleteCategory = async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    sendSuccessResponse({
      res: res,
    });
  };

  getAllCategories = async (req: Request, res: Response) => {
    let queries = getMongooseQueries({
      query: req.query,
      pagination: false,
      options: {
        id: {
          raw: true,
          newName: "_id",
        },
      },
    });
    queries.conditions = localizeConditions(
      req.language,
      queries.conditions,
      "name"
    );

    sendSuccessResponse({
      res: res,
      data: await this.service.getAll(queries),
    });
  };

  createSubCategory = async (req: Request, res: Response) => {
    let file = getFilesByFieldName(req, "image");
    sendSuccessResponse({
      res: res,
      data: await this.subCategoryService.create({
        name: req.body.name,
        category: req.body.category,
        file: file.at(0),
      }),
    });
  };

  editSubCategory = async (req: Request, res: Response) => {
    let file = getFilesByFieldName(req, "image");
    sendSuccessResponse({
      res: res,
      data: await this.subCategoryService.edit({
        id: req.params.id!,
        name: req.body.name,
        file: file.at(0) || req.body.image,
      }),
    });
  };

  deleteSubCategory = async (req: Request, res: Response) => {
    await this.subCategoryService.delete(req.params.id!);
    sendSuccessResponse({
      res: res,
    });
  };

  getAllSubCategories = async (req: Request, res: Response) => {
    let queries = getMongooseQueries({
      query: req.query,
      pagination: false,
      options: {
        id: {
          raw: true,
          newName: "_id",
        },
        category: {
          raw: true,
        },
      },
    });
    queries.conditions = localizeConditions(
      req.language,
      queries.conditions,
      "name"
    );
    sendSuccessResponse({
      res: res,
      data: await this.subCategoryService.getAll(queries),
    });
  };
}

import { Request, Response } from "express";
import { StoreService } from "./service";
import {
  getFilesByFieldName,
  getMongooseQueries,
  sendSuccessResponse,
} from "../../core";
import { localizeConditions } from "../common";
import { permittedFieldsOf } from "@casl/ability/extra";

export class StoreController {
  service = new StoreService();

  create = async (req: Request, res: Response) => {
    let file = getFilesByFieldName(req, "image").at(0);
    sendSuccessResponse({
      res: res,
      data: await this.service.create({ image: file, ...req.body }),
    });
  };

  edit = async (req: Request, res: Response) => {
    let file = getFilesByFieldName(req, "image").at(0);
    sendSuccessResponse({
      res: res,
      data: await this.service.edit(req.params.id!, {
        image: file || req.body.image,
        ...req.body,
      }),
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.params.id!);
    sendSuccessResponse({
      res: res,
    });
  };

  getAll = async (req: Request, res: Response) => {
    let query = getMongooseQueries({
      query: req.query,
      options: {
        id: {
          raw: true,
          newName: "_id",
        },
        owner: {
          raw: true,
        },
      },
    });
    query.conditions = localizeConditions(
      req.language,
      query.conditions,
      "name"
    );
    sendSuccessResponse({
      res: res,
      ...(await this.service.getAll(query,)),
    });
  };

  getMineStores = async (req: Request, res: Response) => {
    sendSuccessResponse({
      res: res,
      data: await this.service.getMineStore(req.user!._id!),
    });
  };
}

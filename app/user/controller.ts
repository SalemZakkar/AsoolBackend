import { Request, Response, NextFunction } from "express";
import { UserService } from "./service";
import { sendSuccessResponse } from "../../core";
import { UserUpdateFields } from "./interface";

export class UserController {
  private service = new UserService();

  getMine = async (req: Request, res: Response, next: NextFunction) => {
    let userId = (req as any).userId;
    let user = await this.service.getUserById(userId);
    sendSuccessResponse({ res: res, data: user });
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    let fields: UserUpdateFields = req.body;
    let user = await this.service.update(req.params!.id!, fields);
    sendSuccessResponse({ res: res, data: user });
  };
}

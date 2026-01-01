import { accessibleFieldsBy } from "@casl/mongoose";
import {
  DBNotFoundError,
  executeWithTransaction,
  MongoId,
  MongooseQuery,
} from "../../core";
import { FileService } from "../files";
import { CategoryModel, IUser, StoreModel, UserRole } from "../models";
import { UserService } from "../user";
import { StoreUserShouldBeStoreOwnerError } from "./errors";
import { StoreAction } from "./abilities";

export class StoreService {
  service = new FileService();
  userService = new UserService();

  create = async (data: any) => {
    let { ...input } = data;
    let categories: string[] = input.categories;
    let user = await this.userService.getUser({ _id: data.owner });
    if (user.role != UserRole.shop) {
      throw new StoreUserShouldBeStoreOwnerError();
    }
    for (let i = 0; i < categories.length; i++) {
      if (!(await CategoryModel.exists({ _id: categories[i] }))) {
        throw new DBNotFoundError();
      }
    }
    input.image = await this.service.saveFile(data.image);
    return await new StoreModel(input).save();
  };

  edit = async (id: MongoId, data: any) => {
    let { ...input } = data;
    let old = await StoreModel.findByIdIfExists(id);
    let categories: string[] = input.categories || [];
    for (let i = 0; i < categories.length; i++) {
      if (!(await CategoryModel.exists({ _id: categories[i] }))) {
        throw new DBNotFoundError();
      }
    }
    return await executeWithTransaction(async (s) => {
      input.image = await this.service.processSingleFileSwitch(
        input.image,
        old.image,
        s
      );
      return await StoreModel.findByIdAndUpdate(id, input, {
        session: s,
        new: true,
      });
    });
  };

  delete = async (id: MongoId) => {
    let old = await StoreModel.findByIdIfExists(id);
    return await executeWithTransaction(async (s) => {
      await this.service.deleteFile(old.image, s);
      return await StoreModel.findByIdAndUpdate(id, {
        session: s,
        new: true,
      });
    });
  };

  getAll = async (params: MongooseQuery,) => {
    return StoreModel.findAndCount(params);
  };

  getMineStore = async (id: MongoId) => {
    return await StoreModel.find({owner: id});
  }
}

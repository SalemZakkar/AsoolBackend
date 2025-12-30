import {
  DBNotFoundError,
  executeWithTransaction,
  MongooseQuery,
} from "../../core";
import { FileService } from "../files";
import { CategoryModel, SubCategoryModel } from "../models";

export class CategoryService {
  fileService = new FileService();
  create = async (params: any) => {
    let { name, file } = params;

    return executeWithTransaction(async (session) => {
      return CategoryModel.insertOne(
        {
          image: (await this.fileService.saveFile(file, session))?._id,
          name: name,
        },
        { session: session }
      );
    });
  };

  edit = async (params: any) => {
    let { id, name, file } = params;
    console.log(file);

    let old = await CategoryModel.findByIdIfExists(id);
    return executeWithTransaction(async (session) => {
      return CategoryModel.findByIdAndUpdate(
        id,
        {
          image: await this.fileService.processSingleFileSwitch(
            file,
            old.image,
            session
          ),
          name: name,
        },
        { new: true, session: session }
      );
    });
  };

  delete = async (params: any) => {
    await executeWithTransaction(async (s) => {
      let old = await CategoryModel.findByIdIfExists(params);
      await this.fileService.deleteFile(old.image, s);
      await CategoryModel.deleteIfExists(params, s);
    });
  };

  getAll = async (params: MongooseQuery) => {
    return CategoryModel.find(params.conditions).sort(params.sort);
  };
}

export class SubCategoryService {
  fileService = new FileService();
  categoryService = new CategoryService();
  create = async (params: any) => {
    let { category, name, file } = params;
    return executeWithTransaction(async (session) => {
      let k = await CategoryModel.exists({ _id: category });
      if (!k) {
        throw new DBNotFoundError();
      }
      return SubCategoryModel.insertOne(
        {
          image: (await this.fileService.saveFile(file, session))?._id,
          name: name,
          category: category,
        },
        { session: session }
      );
    });
  };

  edit = async (params: any) => {
    let { id, name, file } = params;
    let old = await SubCategoryModel.findByIdIfExists(id);
    return executeWithTransaction(async (session) => {
      return SubCategoryModel.findByIdAndUpdate(
        id,
        {
          image: await this.fileService.processSingleFileSwitch(
            file,
            old.image,
            session
          ),
          name: name,
        },
        { new: true, session: session }
      );
    });
  };

  delete = async (params: any) => {
    await executeWithTransaction(async (s) => {
      let old = await SubCategoryModel.findByIdIfExists(params);
      await this.fileService.deleteFile(old.image, s);
      await SubCategoryModel.deleteIfExists(params, s);
    });
  };

  getAll = async (params: MongooseQuery) => {
    return SubCategoryModel.find(params.conditions).sort(params.sort);
  };
}

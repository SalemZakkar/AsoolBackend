import { AccessConfig, CaslUtil } from "../../core/access/permission";
import { UserRole } from "../models";

export enum CategoryActions {
  create = "Create",
  edit = "Edit",
  delete = "Delete",
}

let permissions: AccessConfig = {
  [UserRole.admin]: (user) => [
    {
      action: [
        CategoryActions.create,
        CategoryActions.delete,
        CategoryActions.edit,
      ],
      subject: "Category",
    },
  ],
};

CaslUtil.add("Category", permissions);

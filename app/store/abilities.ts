import {
  AccessConfig,
  CaslUtil,
} from "../../core/access/permission";
import { UserRole } from "../models";

const subject = "store";

export enum StoreAction {
  manage = "manage",
  edit = "edit",
  getMineStores = "mineStore",
}

let permissions: AccessConfig = {
  [UserRole.admin]: (user) => [
    {
      subject: subject,
      action: StoreAction.manage,
    },
  ],
  [UserRole.shop]: (user) => [
    {
      subject: subject,
      action: StoreAction.edit,
      conditions: {
        owner: user._id,
      },
    },
    {
      subject: subject,
      action: StoreAction.getMineStores,
      conditions: {
        owner: user._id,
      },
    },
  ],
};

CaslUtil.add(subject, permissions);

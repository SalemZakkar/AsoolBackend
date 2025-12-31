import { AccessConfig, CaslUtil } from "../../core/access/permission";
import { UserRole } from "../models";

const subject = "store";

export enum StoreAction {
  manage = "Manage",
}

let permissions: AccessConfig = {
  [UserRole.admin]: (user) => [
    {
      subject: subject,
      action: StoreAction.manage,
    },
  ],
};

CaslUtil.add(subject, permissions);

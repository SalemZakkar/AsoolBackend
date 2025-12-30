import { AccessConfig, CaslUtil } from "../../core/access/permission";
import { UserRole } from "../models";

const subject = "user";

export enum UserAction {
  manage = "Manage",
}

let permissions: AccessConfig = {
  [UserRole.admin]: (user) => [
    {
      subject: subject,
      action: UserAction.manage,
    },
  ],
};

CaslUtil.add(subject, permissions);

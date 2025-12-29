import { AccessConfig, CaslUtil } from "../../core/access/permission";
import { UserRole } from "../models";

const subject = "user";

let permissions: AccessConfig = {
  [UserRole.admin]: (user) => [
    {
      subject: subject,
      action: "manage",
    },
  ],
};

CaslUtil.add(subject, permissions);

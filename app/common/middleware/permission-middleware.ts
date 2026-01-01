import { NextFunction, Request, Response } from "express";
import { AccessUnAllowedError, CaslUtil } from "../../../core";
const { Ability } = require("@casl/ability");

export const permissionMiddleWare =
  (
    action: string,
    subject: string,
    options: { strictBody?: boolean; strictQuery?: boolean } = {}
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    let permissions = CaslUtil.getUserAbilities(req.user, req.user?.role);
    req.abilities = permissions;
    if (permissions.can(action, subject)) {
      if (options.strictBody) {
        CaslUtil.forbidFields({
          action: action,
          subject: subject,
          user: req.user,
          body: req.body,
          role: req.user?.role,
        });
      }
      if (options.strictQuery) {
        
        CaslUtil.forbidFields({
          action: action,
          subject: subject,
          user: req.user,
          body: req.query,
          role: req.user?.role,
        });
      }
      return next();
    }
    throw new AccessUnAllowedError();
  };

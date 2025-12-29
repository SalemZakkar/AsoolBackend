import { NextFunction, Request, Response } from "express";
import { AccessUnAllowedError, CaslUtil } from "../../core/access";
const { Ability } = require("@casl/ability");

export const permissionMiddleWare =
  (action: string, subject: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    let permissions = CaslUtil.buildBackendAbilities(req.user, req.user!.role);
    req.user!.ability = new Ability(permissions);
    if (req.user!.ability.can(action, subject)) return next();
    throw new AccessUnAllowedError();
  };

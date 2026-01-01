import { AccessUnAllowedError } from "./errors";

const { Ability } = require("@casl/ability");

type PermissionFn = (user: any) => AccessAction[];
export type AccessConfig = Record<string, PermissionFn>;
export type AcessFields = Record<string, string>;

export interface AccessAction {
  subject: string;
  action: string | string[];
  fields?: string[] | undefined;
  forbiddenFields?: string[] | undefined;
  conditions?: object | undefined;
}

class CaslUtility {
  table: Map<string, AccessConfig> = new Map<
    string,
    Record<string, PermissionFn>
  >();

  add = (subject: string, value: AccessConfig) => {
    this.table.set(subject, value);
  };

  buildBackendAbilities(user: any, role: string): AccessAction[] {
    return Array.from(this.table.values()).flatMap((roleMap) => {
      const fn = roleMap[role];
      if (!fn) return [];

      const actions = fn(user);
      return actions.flatMap((perm) => {
        const actionList = Array.isArray(perm.action)
          ? perm.action
          : [perm.action];
        return actionList.map((a) => ({
          ...perm,
          action: a,
          fields: perm.fields ?? [""],
        }));
      });
    });
  }

  getUserAbilities(user: any, role: string | undefined = undefined) {
    let t = this.buildBackendAbilities(user, role || "*");

    return new Ability(t);
  }

  forbidFields(input: {
    user: any;
    role?: string | undefined;
    subject: string;
    action: string;
    body: any;
  }) {
    if (typeof input.body === "object") {
      let keys = Object.keys(input.body || {});
      let perm = this.buildBackendAbilities(input.user, input.role || "*");
      for (let i = 0; i < perm.length; i++) {
        if (
          perm[i]?.action == input.action &&
          perm[i]?.subject == input.subject
        ) {
          let forb = perm[i]?.forbiddenFields || [];
          for (let j = 0; j < forb.length; j++) {
            
            if (keys.includes(forb[j]!)) {
              throw new AccessUnAllowedError(
                `${forb[j]} is not allowed for ${input.role || "*"}`
              );
            }
          }
          break;
        }
      }
    }
  }
}

let util = new CaslUtility();

export { util as CaslUtil };

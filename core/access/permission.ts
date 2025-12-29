type PermissionFn = (user: any) => AccessAction[];
export type AccessConfig = Record<string , PermissionFn>;

export interface AccessAction {
  subject: string;
  action: string | string[];
  fields?: string[] | undefined;
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
        }));
      });
    });
  }
}

let util = new CaslUtility();

export { util as CaslUtil };

import type { AccessArgs } from "payload/config";

import type { Admin } from "../../../payload-types";
import { checkRole } from "../checkRole";

type isAdmin = (args: AccessArgs<unknown, Admin>) => boolean;

export const admins: isAdmin = ({ req: { user } }) => {
  if (!user) {
    return false;
  }
  return checkRole(["admin"], user);
};

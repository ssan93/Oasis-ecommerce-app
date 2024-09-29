import type { Admin } from "../../payload-types";

export const checkRole = (allRoles: Admin["roles"], user?: Admin): boolean => {
  if (user) {
    if (
      allRoles.some((role) => {
        return user?.roles?.some((individualRole) => {
          return individualRole === role;
        });
      })
    )
      return true;
  }

  return false;
};

import type { Access } from "payload/config";
import { admins } from "../../Admins/access/admins";

export const myOrder: Access = ({ req }) => {
  if (admins({ req })) {
    return true;
  }
  return {
    user: {
      equals: req.user.id,
    },
  };
};

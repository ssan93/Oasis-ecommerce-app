import { Access } from "payload/config";

export const user: Access = ({ req: { user } }) => {
  return {
    id: {
      equals: user.id,
    },
  };
};

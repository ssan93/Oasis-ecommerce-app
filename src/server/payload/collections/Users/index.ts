import { CollectionConfig } from "payload/types";
import { admins } from "../Admins/access/admins";
import { user } from "./access/user";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `
          <p>Click the link below to verify your email address:</p>
          <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}">Verify Email</a>
        `;
      },
    },
  },
  access: {
    admin: admins,
    read: () => true,
    create: () => true,
    update: () => false,
    delete: user,
  },
  fields: [
    {
      name: "role",
      required: true,
      defaultValue: "user",
      admin: {
        condition: () => true,
      },
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};

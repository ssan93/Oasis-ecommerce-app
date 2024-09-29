import { CollectionConfig } from "payload/types";
import { admins } from "../Admins/access/admins";
import { user } from "./access/user";
import { PrimaryActionEmailHtml } from "../../../../app/_components/emails/PrimaryActionEmail";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
        });
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

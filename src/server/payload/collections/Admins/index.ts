import { CollectionConfig } from "payload/types";
import { admins } from "./access/admins";
import { Admin } from "../../payload-types";
import { AfterChangeHook } from "payload/dist/collections/config/types";
import { PrimaryActionEmailHtml } from "../../../../app/_components/emails/PrimaryActionEmail";

const syncUser: AfterChangeHook<Admin> = async ({ req, doc }) => {
  const user = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  if (user && typeof user === "object") {
    await req.payload.update({
      collection: "users",
      id: user.id,
      data: {
        email: doc.email,
        password: doc.password,
      },
    });
  } else {
    await req.payload.create({
      collection: "users",
      data: {
        email: doc.email,
        password: doc.password,
        role: "admin",
      },
    });
  }
};

export const Admins: CollectionConfig = {
  slug: "admins",
  admin: {
    useAsTitle: "email",
  },
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
  hooks: {
    afterChange: [syncUser],
  },
  fields: [
    {
      name: "roles",
      required: true,
      defaultValue: "publisher",
      access: {
        create: admins,
        update: admins,
      },
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Publisher",
          value: "publisher",
        },
      ],
      hasMany: true,
    },
  ],
};

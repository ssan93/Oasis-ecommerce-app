import { CollectionConfig } from "payload/types";
import { admins } from "../Admins/access/admins";
import { myOrder } from "./access/my-order";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    // read: myOrder,
    read: () => true,
    create: () => true,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      required: true,
      defaultValue: false,
      // access: {
      //   read: admins,
      //   create: () => false,
      //   update: () => false,
      // },
      admin: {
        hidden: true,
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      // admin: {
      //   hidden: true,
      // },
    },
    {
      name: "products_quantities",
      type: "array",
      label: "Products and quantities",
      minRows: 1,
      labels: {
        singular: "Product",
        plural: "Products",
      },
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
        },
      ],
      required: true,
      // admin: {
      //   readOnly: true,
      // },
    },
  ],
};

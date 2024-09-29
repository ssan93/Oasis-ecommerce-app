import { stripe } from "../../../../lib/stripe";
import { CollectionConfig } from "payload/types";
import { Product } from "../../payload-types";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price"],
  },
  hooks: {
    beforeChange: [
      async (args) => {
        const { operation } = args;
        if (operation === "create") {
          const data = args.data as Product;

          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "krw",
              unit_amount: data.price,
            },
          });

          const updatedData = {
            ...data,
            priceId: createdProduct.default_price,
            stripeId: createdProduct.id,
          };

          return updatedData;
        } else if (operation === "update") {
          const data = args.data as Product;

          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          const updatedData = {
            ...data,
            priceId: updatedProduct.default_price,
            stripeId: updatedProduct.id,
          };

          return updatedData;
        }
      },
    ],
  },

  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "price",
      label: "Price in WON",
      type: "number",
      min: 0,
      required: true,
    },
    {
      name: "description",
      label: "Product details",
      type: "textarea",
    },
    {
      name: "stock",
      label: "Stock",
      type: "number",
    },
    {
      name: "images",
      type: "array",
      label: "Product images",
      minRows: 1,
      maxRows: 4,
      // required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "medias",
          // required: true,
        },
      ],
    },
    {
      name: "tags",
      label: "Tags",
      type: "select",
      options: [
        {
          label: "Best",
          value: "best",
        },
        {
          label: "New",
          value: "new",
        },
        {
          label: "Sale",
          value: "sale",
        },
      ],
      hasMany: true,
    },
    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
  ],
};

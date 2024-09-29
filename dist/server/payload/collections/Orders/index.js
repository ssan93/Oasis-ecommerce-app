"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
var admins_1 = require("../Admins/access/admins");
exports.Orders = {
    slug: "orders",
    access: {
        // read: myOrder,
        read: function () { return true; },
        create: function () { return true; },
        update: admins_1.admins,
        delete: admins_1.admins,
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

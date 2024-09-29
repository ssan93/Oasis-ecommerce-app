"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
exports.Categories = {
    slug: "categories",
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
        },
    ],
};

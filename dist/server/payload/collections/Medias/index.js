"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medias = void 0;
exports.Medias = {
    slug: "medias",
    access: {
        read: function () { return true; }, // Allow everyone to read media files
    },
    upload: {
        staticURL: "/server/media",
        staticDir: "media",
        imageSizes: [
            {
                name: "thumbnail",
                width: 400,
                height: 300,
                position: "centre",
            },
            {
                name: "card",
                width: 768,
                height: 1024,
                position: "centre",
            },
            {
                name: "tablet",
                width: 1024,
                height: undefined,
                position: "centre",
            },
        ],
        mimeTypes: ["image/*"],
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            hasMany: false,
            admin: {
                condition: function () { return false; },
            },
        },
    ],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var admins_1 = require("../Admins/access/admins");
var user_1 = require("./access/user");
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return "\n          <p>Click the link below to verify your email address:</p>\n          <a href=\"".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "\">Verify Email</a>\n        ");
            },
        },
    },
    access: {
        admin: admins_1.admins,
        read: function () { return true; },
        create: function () { return true; },
        update: function () { return false; },
        delete: user_1.user,
    },
    fields: [
        {
            name: "role",
            required: true,
            defaultValue: "user",
            admin: {
                condition: function () { return true; },
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

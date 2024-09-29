"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack"); // To use admin panel
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var config_1 = require("payload/config");
var path_1 = __importDefault(require("path"));
var collections_1 = require("./payload/collections");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: [".env.local", ".env"] });
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    cookiePrefix: process.env.NODE_ENV === "production" ? "payload-prod" : "payload-dev",
    collections: [collections_1.Admins, collections_1.Users, collections_1.Products, collections_1.Categories, collections_1.Medias, collections_1.Orders],
    admin: {
        user: "admins",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: " | Payload",
            favicon: "/logo-7web-white.png",
            ogImage: "/logo-7web.png",
        },
    },
    routes: {
        admin: "/admin",
    },
    rateLimit: {
        // By default, the rate is 500
        max: 2000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.DATABASE_URI,
    }),
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload/payload-types.ts"),
    },
});

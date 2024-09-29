"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_COOKIE_NAME = exports.TRANSACTION_FEE = exports.ITEM_FALLBACK_LIMIT = exports.ITEM_MAX_QUANTITY_SELECTOR = void 0;
exports.ITEM_MAX_QUANTITY_SELECTOR = 5;
exports.ITEM_FALLBACK_LIMIT = 4;
exports.TRANSACTION_FEE = 1000;
exports.SECRET_COOKIE_NAME = "payload-".concat(process.env.NODE_ENV === "production" ? "prod" : "dev", "-token");

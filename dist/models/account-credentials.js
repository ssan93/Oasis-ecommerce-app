"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpSchema = exports.AuthCredentialsSchema = void 0;
var zod_1 = require("zod");
exports.AuthCredentialsSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
exports.SignUpSchema = exports.AuthCredentialsSchema.extend({
    confirmPassword: zod_1.z.string(),
}).refine(function (_a) {
    var password = _a.password, confirmPassword = _a.confirmPassword;
    return password === confirmPassword;
}, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

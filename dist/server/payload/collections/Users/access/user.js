"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
var user = function (_a) {
    var user = _a.req.user;
    return {
        id: {
            equals: user.id,
        },
    };
};
exports.user = user;

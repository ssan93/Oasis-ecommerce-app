"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myOrder = void 0;
var admins_1 = require("../../Admins/access/admins");
var myOrder = function (_a) {
    var req = _a.req;
    if ((0, admins_1.admins)({ req: req })) {
        return true;
    }
    return {
        user: {
            equals: req.user.id,
        },
    };
};
exports.myOrder = myOrder;

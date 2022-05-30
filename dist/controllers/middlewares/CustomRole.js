"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_role = exports.ROLES = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
var set = require("lodash.set");
var ROLES;
(function (ROLES) {
    ROLES[ROLES["Super Admin"] = 1] = "Super Admin";
    ROLES[ROLES["Admin"] = 2] = "Admin";
    ROLES[ROLES["Users"] = 3] = "Users";
})(ROLES = exports.ROLES || (exports.ROLES = {}));
const send401WithMessage = (res) => {
    res.status(http_status_codes_1.UNAUTHORIZED).send({
        message: "You are not authorized to use this service",
    });
};
function auth_role(role) {
    return function (req, res, next) {
        var _a;
        const authorizationHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : "";
        const parts = authorizationHeader.split(" ");
        if (parts.length === 2) {
            // const scheme = parts[0];
            const token = parts[1];
            if (!token) {
                return send401WithMessage(res);
            }
            jsonwebtoken_1.default.verify(token, "My secret", (err, payload) => {
                if (err) {
                    return send401WithMessage(res);
                }
                const { roleId } = payload;
                if (roleId > role) {
                    return send401WithMessage(res);
                }
                set(req, "payload", payload);
                next();
            });
        }
        else {
            return send401WithMessage(res);
        }
    };
}
exports.auth_role = auth_role;
//# sourceMappingURL=CustomRole.js.map
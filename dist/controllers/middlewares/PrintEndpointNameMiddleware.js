"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintEndpointNameMiddleware = void 0;
const simple_color_print_1 = require("simple-color-print");
const util_1 = __importDefault(require("util"));
exports.PrintEndpointNameMiddleware = (req, res, next) => {
    simple_color_print_1.cinfo("Endpoint called ===> " + req.originalUrl);
    simple_color_print_1.cinfo("Parameters ===> " + util_1.default.inspect(req.body, { breakLength: Infinity }));
    next();
};
//# sourceMappingURL=PrintEndpointNameMiddleware.js.map
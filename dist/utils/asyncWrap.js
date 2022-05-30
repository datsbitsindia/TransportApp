"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrap = void 0;
function asyncWrap(promise) {
    return promise.then((result) => [null, result]).catch((err) => [err]);
}
exports.asyncWrap = asyncWrap;
//# sourceMappingURL=asyncWrap.js.map
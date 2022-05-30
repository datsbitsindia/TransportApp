"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const core_1 = require("@overnightjs/core");
const logger_1 = require("@overnightjs/logger");
const AddNewUser_1 = require("./MobileAppApis/AddNewUser");
const LoginUser_1 = require("./MobileAppApis/LoginUser");
let ParentController = class ParentController {
    get(req, res) {
        const message = "Hi I'm the parent controller";
        logger_1.Logger.Info(message);
        return res.status(http_status_codes_1.OK).json({ message });
    }
};
__decorate([
    core_1.Get()
], ParentController.prototype, "get", null);
ParentController = __decorate([
    core_1.Controller("api/mobile"),
    core_1.ClassOptions({ mergeParams: true }),
    core_1.ChildControllers([new AddNewUser_1.AddNewUser(), new LoginUser_1.LoginController()])
], ParentController);
exports.ParentController = ParentController;
//# sourceMappingURL=MobileAppController.js.map
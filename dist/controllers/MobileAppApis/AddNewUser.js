"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNewUser = void 0;
const core_1 = require("@overnightjs/core");
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../Dal/db");
const asyncWrap_1 = require("../../utils/asyncWrap");
const passwordHash_1 = require("../../utils/passwordHash");
let AddNewUser = class AddNewUser {
    addNewUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
            }
            const { fullName, email, mobileNumber, password, userType } = req.body;
            const [error, result] = yield asyncWrap_1.asyncWrap(db_1.runSP("IU_RegisterUsers", [
                {
                    name: "UserID",
                    value: 0,
                },
                {
                    name: "UserTypeID",
                    value: userType,
                },
                {
                    name: "FullName",
                    value: fullName,
                },
                {
                    name: "Email",
                    value: email,
                },
                {
                    name: "MobileNo",
                    value: mobileNumber,
                },
                {
                    name: "Password",
                    value: passwordHash_1.hashPassword(password),
                },
                {
                    name: "LoginUserId",
                    value: 1,
                },
            ]));
            console.log(result);
            if (!result) {
                return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    message: "Something went wrong!",
                });
            }
            return res.status(http_status_codes_1.OK).send({
                message: result.recordset[0].MESSAGE,
                status: result.recordset[0].STATUS,
                success: true,
            });
        });
    }
};
__decorate([
    core_1.Post(""),
    core_1.Middleware([express_validator_1.body("email", "Please provide email").exists()])
], AddNewUser.prototype, "addNewUser", null);
AddNewUser = __decorate([
    core_1.Controller("addNewUser"),
    core_1.ClassOptions({ mergeParams: true })
], AddNewUser);
exports.AddNewUser = AddNewUser;
//# sourceMappingURL=AddNewUser.js.map
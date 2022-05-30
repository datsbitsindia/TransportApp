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
exports.SignupAdminContoller = void 0;
const core_1 = require("@overnightjs/core");
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../Dal/db");
const asyncWrap_1 = require("../utils/asyncWrap");
const CustomRole_1 = require("./middlewares/CustomRole");
let SignupAdminContoller = class SignupAdminContoller {
    addAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, email, mobileNumber, roleId, userId, userName, password, exposureLimit, CreditReference, CommissionSetting, PartnershipSetting, BetLimitSetting, MinimumOdds, MaximumOdds, TransctionCode, } = req.body;
            const [error, result] = yield asyncWrap_1.asyncWrap(db_1.runSP("IU_Users", [
                {
                    name: "UserID",
                    value: userId,
                },
                {
                    name: "RoleID",
                    value: roleId,
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
                    name: "PhoneNumber",
                    value: mobileNumber,
                },
                {
                    name: "UserName",
                    value: userName,
                },
                {
                    name: "Password",
                    value: password,
                },
                {
                    name: "Email",
                    value: email,
                },
                {
                    name: "ExposureLimit",
                    value: exposureLimit,
                },
                {
                    name: "CreditReference",
                    value: CreditReference,
                },
                {
                    name: "CommissionSetting",
                    value: CommissionSetting,
                },
                {
                    name: "PartnershipSetting",
                    value: PartnershipSetting,
                },
                {
                    name: "BetLimitSetting",
                    value: BetLimitSetting,
                },
                {
                    name: "MinimumOdds",
                    value: MinimumOdds,
                },
                {
                    name: "MaximumOdds",
                    value: MaximumOdds,
                },
                {
                    name: "TransctionCode",
                    value: TransctionCode,
                },
                {
                    name: "LoginUserID",
                    value: +req.payload.userId,
                },
            ]));
            if (!result) {
                return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    code: -1,
                    message: "Something went wrong!",
                });
            }
            return res.status(http_status_codes_1.OK).send({
                success: true,
                code: +result.recordset[0].status,
                message: result.recordset[0].message,
            });
        });
    }
};
__decorate([
    core_1.Post(""),
    core_1.Middleware(CustomRole_1.auth_role(CustomRole_1.ROLES["Super Admin"]))
], SignupAdminContoller.prototype, "addAdmin", null);
SignupAdminContoller = __decorate([
    core_1.Controller("admin/addUser")
], SignupAdminContoller);
exports.SignupAdminContoller = SignupAdminContoller;
//# sourceMappingURL=UserController.js.map
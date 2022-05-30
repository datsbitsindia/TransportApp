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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const VerifyToken_1 = require("./middlewares/VerifyToken");
const core_1 = require("@overnightjs/core");
const util_1 = __importDefault(require("util"));
const passwordHash_1 = require("../utils/passwordHash");
const asyncWrap_1 = require("../utils/asyncWrap");
const db_1 = require("../Dal/db");
const { OVERNIGHT_JWT_SECRET, OVERNIGHT_JWT_EXP } = process.env;
let LoginController = class LoginController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            console.log(OVERNIGHT_JWT_EXP, OVERNIGHT_JWT_SECRET);
            const { password, userName } = req.body;
            console.log(userName);
            const [error, result] = yield asyncWrap_1.asyncWrap(db_1.runSP("UserLogin", [
                {
                    name: "UserName",
                    value: userName,
                },
            ]));
            if (result.recordset[0].userId !== "0") {
                const userRecord = result.recordset[0];
                console.log("userRecord=", util_1.default.inspect(userRecord, { breakLength: Infinity }));
                if (passwordHash_1.compareHash(password, userRecord.Password)) {
                    const [error, token] = yield asyncWrap_1.asyncWrap(VerifyToken_1.sign_token({
                        userName: userRecord.UserName,
                        userId: userRecord.UserID,
                        roleId: userRecord.RoleID,
                    }, {
                        expiresIn: "28d",
                        secret: "My secret",
                    }));
                    if (!error) {
                        return res.status(http_status_codes_1.OK).json({
                            message: "Login success.",
                            data: {
                                userName: userRecord.UserName,
                                userId: userRecord.UserID,
                                token,
                                role: {
                                    roleId: userRecord.RoleID,
                                    name: userRecord.RoleName,
                                },
                            },
                        });
                    }
                }
            }
            return res.status(http_status_codes_1.UNAUTHORIZED).json({
                message: "UserName/Password does not match. Please retry",
            });
        });
    }
};
__decorate([
    core_1.Post(""),
    core_1.Middleware([
        express_validator_1.body(["userName", "password"], "Username and password should be there").exists(),
    ])
], LoginController.prototype, "login", null);
LoginController = __decorate([
    core_1.Controller("login")
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=loginController.js.map
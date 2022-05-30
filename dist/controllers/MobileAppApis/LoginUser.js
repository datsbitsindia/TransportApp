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
exports.LoginController = void 0;
const core_1 = require("@overnightjs/core");
const express_validator_1 = require("express-validator");
const db_1 = require("../../Dal/db");
const asyncWrap_1 = require("../../utils/asyncWrap");
const passwordHash_1 = require("../../utils/passwordHash");
const http_status_codes_1 = require("http-status-codes");
const VerifyToken_1 = require("../middlewares/VerifyToken");
const { TOKEN_EXPIRY, TOKEN_SECRET } = process.env;
let LoginController = class LoginController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { password, email } = req.body;
            const [error, result] = yield asyncWrap_1.asyncWrap(db_1.runSP("G_UserEmail", [
                {
                    name: "UserName",
                    value: email,
                },
            ]));
            if (result.recordset[0].UserID !== "0") {
                const userRecord = result.recordset[0];
                if (passwordHash_1.compareHash(password, userRecord.Password)) {
                    const [error, token] = yield asyncWrap_1.asyncWrap(VerifyToken_1.sign_token({
                        userId: userRecord.UserID,
                        userRole: userRecord.UserTypeID,
                        userType: userRecord.UserType,
                        fullName: userRecord.FullName,
                        email: userRecord.Email,
                        mobile: userRecord.MobileNo,
                    }, {
                        expiresIn: TOKEN_EXPIRY,
                        secret: TOKEN_SECRET,
                    }));
                    if (error)
                        return res.sendStatus(http_status_codes_1.UNPROCESSABLE_ENTITY);
                    return res.status(http_status_codes_1.OK).send({
                        code: 1,
                        message: "User verified successfully",
                        token,
                        userRole: userRecord.UserTypeID,
                        userType: userRecord.UserType,
                        fullName: userRecord.FullName,
                        email: userRecord.Email,
                        mobile: userRecord.MobileNo,
                        userId: userRecord.UserID,
                    });
                }
            }
            return res.status(http_status_codes_1.UNAUTHORIZED).json({
                message: "UserName/Password does not match. Please retry",
            });
        });
    }
};
__decorate([
    core_1.Post(),
    core_1.Middleware([
        express_validator_1.body(["email", "password"], "Min 4 chars and max 8 chars")
            .exists()
            .isLength({ min: 4, max: 20 }),
    ])
], LoginController.prototype, "login", null);
LoginController = __decorate([
    core_1.Controller("login")
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=LoginUser.js.map
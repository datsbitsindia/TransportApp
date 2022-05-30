import { validationResult, body } from "express-validator";
import { OK, UNAUTHORIZED } from "http-status-codes";
import { sign_token } from "./middlewares/VerifyToken";
import { Controller, Post, Middleware } from "@overnightjs/core";
import util from "util";
import { Request, Response } from "express";

import { compareHash } from "../utils/passwordHash";
import { asyncWrap } from "../utils/asyncWrap";
import { runSP } from "../Dal/db";

const { OVERNIGHT_JWT_SECRET, OVERNIGHT_JWT_EXP } = process.env;

@Controller("login")
export class LoginController {
  @Post("")
  @Middleware([
    body(
      ["userName", "password"],
      "Username and password should be there"
    ).exists(),
  ])
  private async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log(OVERNIGHT_JWT_EXP, OVERNIGHT_JWT_SECRET);
    const { password, userName } = req.body;
    console.log(userName);
    const [error, result] = await asyncWrap(
      runSP("UserLogin", [
        {
          name: "UserName",
          value: userName,
        },
      ])
    );

    if (result.recordset[0].userId !== "0") {
      const userRecord = result.recordset[0];
      console.log(
        "userRecord=",
        util.inspect(userRecord, { breakLength: Infinity })
      );
      if (compareHash(password, userRecord.Password)) {
        const [error, token] = await asyncWrap(
          sign_token(
            {
              userName: userRecord.UserName,
              userId: userRecord.UserID,
              roleId: userRecord.RoleID,
            },
            {
              expiresIn: "28d",
              secret: "My secret",
            }
          )
        );
        if (!error) {
          return res.status(OK).json({
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

    return res.status(UNAUTHORIZED).json({
      message: "UserName/Password does not match. Please retry",
    });
  }
}

import { Controller, Middleware, Post } from "@overnightjs/core";
import { validationResult, body } from "express-validator";
import { runSP } from "../../Dal/db";
import { asyncWrap } from "../../utils/asyncWrap";
import { Request, Response } from "express";
import { compareHash } from "../../utils/passwordHash";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "http-status-codes";
import { sign_token } from "../middlewares/VerifyToken";
const { TOKEN_EXPIRY, TOKEN_SECRET } = process.env;

@Controller("login")
export class LoginController {
  @Post()
  @Middleware([
    body(["email", "password"], "Min 4 chars and max 8 chars")
      .exists()
      .isLength({ min: 4, max: 20 }),
  ])
  private async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { password, email } = req.body;

    const [error, result] = await asyncWrap(
      runSP("G_UserEmail", [
        {
          name: "UserName",
          value: email,
        },
      ])
    );

    if (result.recordset[0].UserID !== "0") {
      const userRecord = result.recordset[0];
      if (compareHash(password, userRecord.Password)) {
        const [error, token] = await asyncWrap(
          sign_token(
            {
              userId: userRecord.UserID,
              userRole: userRecord.UserTypeID,
              userType: userRecord.UserType,
              fullName: userRecord.FullName,
              email: userRecord.Email,
              mobile: userRecord.MobileNo,
            },
            {
              expiresIn: TOKEN_EXPIRY,
              secret: TOKEN_SECRET,
            }
          )
        );

        if (error) return res.sendStatus(UNPROCESSABLE_ENTITY);

        return res.status(OK).send({
          code: 1,
          message: "User verified successfully",
          data: {
            userRole: userRecord.UserTypeID,
            userType: userRecord.UserType,
            fullName: userRecord.FullName,
            email: userRecord.Email,
            mobile: userRecord.MobileNo,
            userId: userRecord.UserID,
            token: token,
          },
        });
      }
    }

    return res.status(UNAUTHORIZED).json({
      message: "UserName/Password does not match. Please retry",
    });
  }
}

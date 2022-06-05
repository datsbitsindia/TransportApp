import { Controller, Middleware, ClassOptions, Post } from "@overnightjs/core";
import { body, validationResult } from "express-validator";
import {
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
  OK,
} from "http-status-codes";
import { runSP } from "../../Dal/db";
import { asyncWrap } from "../../utils/asyncWrap";
import { hashPassword } from "../../utils/passwordHash";
import { sign_token } from "../middlewares/VerifyToken";
const { TOKEN_EXPIRY, TOKEN_SECRET } = process.env;

@Controller("addNewUser")
@ClassOptions({ mergeParams: true })
export class AddNewUser {
  @Post("")
  @Middleware([body("email", "Please provide email").exists()])
  private async addNewUser(req: any, res: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }

    const { fullName, email, mobileNumber, password, userType } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_RegisterUsers", [
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
          value: hashPassword(password),
        },
        {
          name: "LoginUserId",
          value: 1,
        },
      ])
    );

    console.log(result.recordsets);

    if (!result) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        success: false,
        message: "Something went wrong!",
      });
    }

    if (result.recordset[0].STATUS === -1) {
      return res.status(OK).send({
        // data: result?.recordsets[1][0],
        message: result.recordset[0].MESSAGE,
        status: result.recordset[0].STATUS,
        success: true,
      });
    }

    const userRecord = result.data.recordsets[1][0];
    const [tokenError, token] = await asyncWrap(
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

    const data = {
      userId: userRecord.UserID,
      userRole: userRecord.UserTypeID,
      userType: userRecord.UserType,
      fullName: userRecord.FullName,
      email: userRecord.Email,
      mobile: userRecord.MobileNo,
      token: token,
    };
    
    return res.status(OK).send({
      data: data,
      message: result.recordset[0].MESSAGE,
      status: result.recordset[0].STATUS,
      success: true,
    });
  }
}

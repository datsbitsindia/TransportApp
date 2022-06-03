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

    console.log(result);

    if (!result) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        success: false,
        message: "Something went wrong!",
      });
    }

    return res.status(OK).send({
      data: result.recordset,
      success: true,
    });
  }
}

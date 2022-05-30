import { Controller, Middleware, Post } from "@overnightjs/core";
import { INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import { runSP } from "../Dal/db";
import { asyncWrap } from "../utils/asyncWrap";
import { auth_role, ROLES } from "./middlewares/CustomRole";

@Controller("admin/addUser")
export class SignupAdminContoller {
  @Post("")
  @Middleware(auth_role(ROLES["Super Admin"]))
  private async addAdmin(req: any, res: any) {
    const {
      fullName,
      email,
      mobileNumber,
      roleId,
      userId,
      userName,
      password,
      exposureLimit,
      CreditReference,
      CommissionSetting,
      PartnershipSetting,
      BetLimitSetting,
      MinimumOdds,
      MaximumOdds,
      TransctionCode,
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_Users", [
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
      ])
    );

    if (!result) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        success: false,
        code: -1,
        message: "Something went wrong!",
      });
    }

    return res.status(OK).send({
      success: true,
      code: +result.recordset[0].status,
      message: result.recordset[0].message,
    });
  }
}

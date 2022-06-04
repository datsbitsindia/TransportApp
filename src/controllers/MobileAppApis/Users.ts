import { Controller, Middleware, ClassOptions, Get } from "@overnightjs/core";
import { INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import { runSP } from "../../Dal/db";
import { asyncWrap } from "../../utils/asyncWrap";
import { verify_token } from "../middlewares/VerifyToken";
import * as sql from "mssql";

@Controller("users")
@ClassOptions({ mergeParams: true })
export class Users {
  @Get("list")
  @Middleware([verify_token])
  private async getUsersList(req: any, res: any) {
    const { userId, pageNo, userTypeId } = req.query;

    const output = {
      name: "TotalCnt",
      type: { type: sql.Int },
    };

    const [error, result] = await asyncWrap(
      runSP(
        "G_Users",
        [
          {
            name: "UserID",
            value: userId || 0,
          },
          {
            name: "UserTypeID",
            value: userTypeId || 3,
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
        ],
        output
      )
    );

    console.log(result);

    if (!result) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        success: false,
        message: "Something went wrong!",
      });
    }

    return res.status(OK).send({
      code: 1,
      success: true,
      data: result.recordset[0],
      totalCount: result.output.TotalCnt,
    });
  }

  @Get("order")
  @Middleware([verify_token])
  private async getUsersOrder(req: any, res: any) {
    const { userId, pageNo, userTypeId } = req.query;

    const output = {
      name: "TotalCnt",
      type: { type: sql.Int },
    };

    const [error, result] = await asyncWrap(
      runSP(
        "G_UserOrders",
        [
          {
            name: "UserID",
            value: userId || 0,
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
        ],
        output
      )
    );

    console.log(result);

    if (!result) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        success: false,
        message: "Something went wrong!",
      });
    }

    return res.status(OK).send({
      code: 1,
      success: true,
      data: result.recordset[0],
      totalCount: result.output.TotalCnt,
    });
  }
}

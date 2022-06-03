import {
  Controller,
  Middleware,
  ClassOptions,
  Post,
  Get,
} from "@overnightjs/core";
import { INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import { runSP } from "../../Dal/db";
import { asyncWrap } from "../../utils/asyncWrap";
import { verify_token } from "../middlewares/VerifyToken";
import * as sql from "mssql";

@Controller("employee")
@ClassOptions({ mergeParams: true })
export class Employee {
  @Get("order")
  @Middleware([verify_token])
  private async getEmployeeOrder(req: any, res: any) {
    const { empUserId, pageNo } = req.query;

    const output = {
      name: "TotalCnt",
      type: { type: sql.Int },
    };

    const [error, result] = await asyncWrap(
      runSP(
        "G_EmployeeOrders",
        [
          {
            name: "OrderID",
            value: 0,
          },
          {
            name: "EmpUserID",
            value: empUserId,
          },
          {
            name: "LoginUserID",
            value: req.userId,
          },
          {
            name: "PageNo",
            value: pageNo,
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
      data: result.recordset,
      totalCount: result.output.TotalCnt,
    });
  }
}

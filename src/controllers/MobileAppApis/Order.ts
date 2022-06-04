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

@Controller("order")
@ClassOptions({ mergeParams: true })
export class Order {
  @Get("list")
  @Middleware([verify_token])
  private async getOrder(req: any, res: any) {
    const { orderStatus, pageNo } = req.query;

    const output = {
      name: "TotalCnt",
      type: { type: sql.Int },
    };

    const [error, result] = await asyncWrap(
      runSP(
        "G_OrderList",
        [
          {
            name: "OrderStatus",
            value: orderStatus || 0,
          },
          {
            name: "LoginUserID",
            value: req.userId,
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

  @Post("")
  @Middleware([verify_token])
  private async addNewUser(req: any, res: any) {
    const {
      mobileNumber,
      fromAddress,
      toAddress,
      noOfContainer,
      contactPerson,
      companyName,
      weight,
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_Orders", [
        {
          name: "OrderID",
          value: 0,
        },
        {
          name: "FormAddress",
          value: fromAddress,
        },
        {
          name: "ToAddress",
          value: toAddress,
        },
        {
          name: "NoOfContainer",
          value: noOfContainer,
        },
        {
          name: "MobileNo",
          value: mobileNumber,
        },
        {
          name: "ContactPerson",
          value: contactPerson,
        },
        {
          name: "NameOfCompany",
          value: companyName,
        },
        {
          name: "Weight",
          value: weight,
        },
        {
          name: "LoginUserId",
          value: req.userId,
        },
      ])
    );

    if (!result) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        success: false,
        message: "Something went wrong!",
      });
    }

    return res.status(OK).send({
      data: result.recordset[0],
      success: true,
    });
  }

  @Post("assign")
  @Middleware([verify_token])
  private async assignOrder(req: any, res: any) {
    const { orderId, assingTo, assignBy } = req.body;

    const [error, result] = await asyncWrap(
      runSP("U_OrderAssign", [
        {
          name: "OrderID",
          value: +orderId,
        },
        {
          name: "AssignBy",
          value: +req.userId,
        },
        {
          name: "AssignTo",
          value: +assingTo,
        },
        {
          name: "LoginUserId",
          value: +req.userId,
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
      data: result.recordset[0],
      success: true,
    });
  }

  @Post("status")
  @Middleware([verify_token])
  private async updateOrderStatus(req: any, res: any) {
    const { orderId, orderStatus } = req.body;

    const [error, result] = await asyncWrap(
      runSP("U_OrderStatus", [
        {
          name: "OrderID",
          value: orderId,
        },
        {
          name: "OrderStatus",
          value: orderStatus,
        },
        {
          name: "LoginUserId",
          value: req.userId,
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
      data: result.recordset[0],
      success: true,
    });
  }
}

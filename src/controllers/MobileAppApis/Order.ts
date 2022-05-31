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
            value: orderStatus,
          },
          {
            name: "LoginUserID",
            value: req.userID,
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
          value: req.userID,
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
      message: result.recordset[0].MESSAGE,
      status: result.recordset[0].STATUS,
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
          value: orderId,
        },
        {
          name: "AssignBy",
          value: assignBy,
        },
        {
          name: "AssignTo",
          value: assingTo,
        },
        {
          name: "LoginUserId",
          value: req.userID,
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
      message: result.recordset[0].MESSAGE,
      status: result.recordset[0].STATUS,
      success: true,
    });
  }

  @Post("status")
  @Middleware([verify_token])
  private async updateOrderStatus(req: any, res: any) {
    const { orderId, assingTo, assignBy } = req.body;

    const [error, result] = await asyncWrap(
      runSP("U_OrderAssign", [
        {
          name: "OrderID",
          value: orderId,
        },
        {
          name: "OrderStatus",
          value: assignBy,
        },
        {
          name: "LoginUserId",
          value: req.userID,
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
      message: result.recordset[0].MESSAGE,
      status: result.recordset[0].STATUS,
      success: true,
    });
  }
}

import { OK } from "http-status-codes";
import { Request, Response } from "express";
import {
  Controller,
  ChildControllers,
  Get,
  ClassOptions,
} from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

import { AddNewUser } from "./MobileAppApis/AddNewUser";
import { LoginController } from "./MobileAppApis/LoginUser";
import { Order } from "./MobileAppApis/Order";
import { Employee } from "./MobileAppApis/EmployeeOrder";
import { Users } from "./MobileAppApis/Users";

@Controller("api/mobile")
@ClassOptions({ mergeParams: true })
@ChildControllers([
  new AddNewUser(),
  new LoginController(),
  new Order(),
  new Employee(),
  new Users(),
])
export class ParentController {
  @Get()
  private get(req: Request, res: Response) {
    const message = "Hi I'm the parent controller";
    Logger.Info(message);
    return res.status(OK).json({ message });
  }
}

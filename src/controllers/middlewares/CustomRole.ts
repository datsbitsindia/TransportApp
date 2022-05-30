import { Request, Response, NextFunction } from "express";
import { JwtManager, ISecureRequest } from "@overnightjs/jwt";
import jwt from "jsonwebtoken";
import { UNAUTHORIZED } from "http-status-codes";
var set = require("lodash.set");

export enum ROLES {
  "Super Admin" = 1,
  "Admin" = 2,
  "Users" = 3,
}

const send401WithMessage = (res: Response) => {
  res.status(UNAUTHORIZED).send({
    message: "You are not authorized to use this service",
  });
};

export function auth_role(
  role: ROLES
): (Request, Response, NextFunction) => void {
  return function (req: Request, res: Response, next: NextFunction) {
    const authorizationHeader: string =
      req.headers.authorization ?? ("" as string);
    const parts = authorizationHeader.split(" ");
    if (parts.length === 2) {
      // const scheme = parts[0];
      const token = parts[1];
      if (!token) {
        return send401WithMessage(res);
      }
      jwt.verify(token, "My secret", (err: any, payload: any) => {
        if (err) {
          return send401WithMessage(res);
        }
        const { roleId } = payload;
        if (roleId > role) {
          return send401WithMessage(res);
        }
        set(req, "payload", payload);
        next();
      });
    } else {
      return send401WithMessage(res);
    }
  };
}

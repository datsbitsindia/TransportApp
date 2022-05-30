import express from "express";
import { Server as httpServer } from "http";
import * as bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { Server } from "@overnightjs/core";
import { cimp } from "simple-color-print";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";
import * as controllers from "./controllers";
import { PrintEndpointNameMiddleware } from "./controllers/middlewares/PrintEndpointNameMiddleware";

dotenv.config();

const port = process.env.PORT ?? 8000;

export class ExpressServer extends Server {
  constructor() {
    super();
    this.setupExpress();
    this.setupControllers();

    // this.app.get("*", (req, res) => {
    //   res.sendFile(path.resolve("public", "index.html"));
    // });
  }

  private setupExpress(): void {
    this.app.use(express.static("public"));
    this.app.use("/uploads", express.static("uploads"));
    this.app.use(bodyParser.json({ limit: "900mb" }));
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan("combined"));
    this.app.enable("trust proxy");
    this.app.set("trust proxy", function () {
      return true;
    });
    this.app.use(PrintEndpointNameMiddleware);
    this.app.use(helmet());
    this.app.use(
      (
        err: express.Errback,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (err) {
          // sendReport([], err.toString(), 'Error in Transportation Development')
        }
      }
    );
  }

  private setupControllers(): void {
    const controllerInstances = [];
    for (const name of Object.keys(controllers)) {
      const controller = (controllers as any)[name];
      if (typeof controller === "function") {
        controllerInstances.push(new controller());
      }
    }
    super.addControllers(controllerInstances);
  }

  public start(): httpServer {
    return this.app.listen(port, () => {
      cimp("Server listening on port:" + port);
    });
  }
}

const server = new ExpressServer();

server.start();

export default ExpressServer;

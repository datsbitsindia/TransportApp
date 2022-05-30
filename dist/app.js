"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const core_1 = require("@overnightjs/core");
const simple_color_print_1 = require("simple-color-print");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const controllers = __importStar(require("./controllers"));
const PrintEndpointNameMiddleware_1 = require("./controllers/middlewares/PrintEndpointNameMiddleware");
dotenv_1.default.config();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
class ExpressServer extends core_1.Server {
    constructor() {
        super();
        this.setupExpress();
        this.setupControllers();
        // this.app.get("*", (req, res) => {
        //   res.sendFile(path.resolve("public", "index.html"));
        // });
    }
    setupExpress() {
        this.app.use(express_1.default.static("public"));
        this.app.use("/uploads", express_1.default.static("uploads"));
        this.app.use(bodyParser.json({ limit: "900mb" }));
        this.app.use(cors_1.default());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(morgan_1.default("combined"));
        this.app.enable("trust proxy");
        this.app.set("trust proxy", function () {
            return true;
        });
        this.app.use(PrintEndpointNameMiddleware_1.PrintEndpointNameMiddleware);
        this.app.use(helmet_1.default());
        this.app.use((err, req, res, next) => {
            if (err) {
                // sendReport([], err.toString(), 'Error in Transportation Development')
            }
        });
    }
    setupControllers() {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = controllers[name];
            if (typeof controller === "function") {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }
    start() {
        return this.app.listen(port, () => {
            simple_color_print_1.cimp("Server listening on port:" + port);
        });
    }
}
exports.ExpressServer = ExpressServer;
const server = new ExpressServer();
server.start();
exports.default = ExpressServer;
//# sourceMappingURL=app.js.map
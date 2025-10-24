"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morganMiddleware_1 = __importDefault(require("./Middleware/morganMiddleware"));
const dbConfig_1 = __importDefault(require("./Config/dbConfig"));
const userRoute_1 = __importDefault(require("./Routes/User/userRoute"));
const expertRoute_1 = __importDefault(require("./Routes/Expert/expertRoute"));
const adminRouter_1 = __importDefault(require("./Routes/Admin/adminRouter"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morganMiddleware_1.default);
(0, dbConfig_1.default)();
app.use("/api/user", userRoute_1.default);
app.use("/api/expert", expertRoute_1.default);
app.use("/api/admin", adminRouter_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

"use strict";
//------------------ required modules -------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morganMiddleware_1 = __importDefault(require("./middleware/morganMiddleware"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const userRoute_1 = __importDefault(require("./routes/user/userRoute"));
const expertRoute_1 = __importDefault(require("./routes/expert/expertRoute"));
const adminRouter_1 = __importDefault(require("./routes/admin/adminRouter"));
const chatRouter_1 = __importDefault(require("./routes/chat/chatRouter"));
const payoutRoutes_1 = __importDefault(require("./routes/admin/payoutRoutes"));
const notificationRoute_1 = __importDefault(require("./routes/user/notificationRoute"));
const http_1 = require("http");
const socketConfig_1 = __importDefault(require("./config/socketConfig"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
//-------------------------- Cors -------------------------------
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
//--------------------------- middlewares -----------------------
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morganMiddleware_1.default);
//----------------------- Confiq Mongodb -----------------------
(0, dbConfig_1.default)();
//----------------------- Cron Jobs -----------------------------
require("./utils/sessionCron");
//---------------------------- routes --------------------------
app.use("/api/user", userRoute_1.default);
app.use("/api/expert", expertRoute_1.default);
app.use("/api/admin", adminRouter_1.default);
app.use("/api/admin/payouts", payoutRoutes_1.default);
app.use("/api/chat", chatRouter_1.default);
app.use('/api/notifications', notificationRoute_1.default);
//----------------------- Socket.IO Server -----------------------
const server = (0, http_1.createServer)(app);
const io = (0, socketConfig_1.default)(server);
//------------------ Error Handling Middleware ------------------
app.use(errorHandler_1.errorHandler);
//----------------------- Server listening -----------------------
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

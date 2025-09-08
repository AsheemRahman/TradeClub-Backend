//------------------ required modules -------------------------

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import morganMiddleware from "./middleware/morganMiddleware";
import mongoDB from "./config/dbConfig";

import userRouter from "./routes/user/userRoute";
import expertRouter from "./routes/expert/expertRoute";
import adminRouter from "./routes/admin/adminRouter";
import chatRouter from "./routes/chat/chatRouter";

import { createServer } from "http";
import configureSocket from "./config/socketConfig";
import { STATUS_CODES } from "./constants/statusCode";
import { ERROR_MESSAGES } from "./constants/message";


dotenv.config();


const port = process.env.PORT || 5000;
const app = express();

//-------------------------- Cors -------------------------------

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);


//--------------------------- middlewares -----------------------

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);


//----------------------- Confiq Mongodb -----------------------

mongoDB();


//---------------------------- routes --------------------------

app.use("/api/user", userRouter);
app.use("/api/expert", expertRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);


//----------------------- Socket.IO Server -----------------------

const server = createServer(app);
const io = configureSocket(server)


//------------------ Error Handling Middleware ------------------

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("Error handling middleware's error", err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    next()
});


//----------------------- Server listening -----------------------

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
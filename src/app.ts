//------------------ required modules -------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morganMiddleware from "./middleware/morganMiddleware";
import mongoDB from "./config/dbConfig";
import userRouter from "./routes/user/userRoute";
import expertRouter from "./routes/expert/expertRoute";
import adminRouter from "./routes/admin/adminRouter";
import { createServer } from "http";
import { Server } from "socket.io";
import chatSocketHandler from "./config/socketConfig";


dotenv.config();


const port = process.env.PORT || 5000;
const app = express();

//------------------ requiring modules -------------------------

app.use(
    cors({
        origin: ["http://localhost:3000"],
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



//----------------------- Socket.IO Server -----------------------

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Attach socket handler
chatSocketHandler(io);

//----------------------- Server listening -----------------------

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
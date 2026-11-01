"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoDB = async () => {
    try {
        await mongoose_1.default.connect(`${process.env.MONGO_URI}`, { dbName: "TradeClub", });
        console.log("mongodb is connected");
    }
    catch (error) {
        console.log("error while connectiong with mongodb", error);
    }
};
exports.default = mongoDB;
//# sourceMappingURL=dbConfig.js.map
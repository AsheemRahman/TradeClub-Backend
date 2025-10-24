"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../Constants/statusCode");
class userController {
    registerPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, password } = req.body;
                if (!username || !email || !password) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: "Username, Email and Password is Required" });
                    return;
                }
            }
            catch (error) {
                console.error("Error during signup:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: `Error while adding user: ${error}` });
            }
        });
    }
}
exports.default = userController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordUtils {
    static async passwordHash(password) {
        const hashpassword = await bcryptjs_1.default.hash(password, 10);
        return hashpassword;
    }
    static async comparePassword(userPassword, dbPassword) {
        return await bcryptjs_1.default.compare(userPassword, dbPassword);
    }
}
exports.default = PasswordUtils;
//# sourceMappingURL=passwordUtils.js.map
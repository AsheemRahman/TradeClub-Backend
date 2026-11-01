"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passwordUtils_1 = __importDefault(require("../../../utils/passwordUtils"));
class ExpertService {
    _expertRepository;
    constructor(userRepository) {
        this._expertRepository = userRepository;
    }
    async findExpertByEmail(email) {
        const user = await this._expertRepository.findExpertByEmail(email);
        return user;
    }
    async registerExpert(userData) {
        if (userData.password) {
            const hashedPassword = await passwordUtils_1.default.passwordHash(userData.password);
            userData.password = hashedPassword;
        }
        return await this._expertRepository.registerExpert(userData);
    }
    async resetPassword(email, password) {
        const hashedPassword = await passwordUtils_1.default.passwordHash(password);
        return await this._expertRepository.resetPassword(email, hashedPassword);
    }
    async storeOtp(email, otp) {
        const storedOtp = await this._expertRepository.storeOtp(email, otp);
        return storedOtp;
    }
    async findOtp(email) {
        const otp = await this._expertRepository.findOtp(email);
        return otp;
    }
    async storeResendOtp(email, otp) {
        const resendOTP = await this._expertRepository.storeResendOtp(email, otp);
        return resendOTP;
    }
    async updateDetails(expertDetails) {
        const expertDetail = await this._expertRepository.updateDetails(expertDetails);
        return expertDetail;
    }
    async getExpertById(expertId) {
        const user = await this._expertRepository.getExpertById(expertId);
        return user;
    }
    ;
    async updateExpertById(expertId, updateData) {
        const updatedExpert = await this._expertRepository.updateExpertById(expertId, updateData);
        return updatedExpert;
    }
    ;
    async getWalletById(expertId) {
        const wallet = await this._expertRepository.getWalletById(expertId);
        return wallet;
    }
    ;
}
exports.default = ExpertService;
//# sourceMappingURL=expertService.js.map
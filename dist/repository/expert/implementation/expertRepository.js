"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../base/implementation/baseRepository");
const otp_1 = require("../../../model/user/otp");
const expertSchema_1 = require("../../../model/expert/expertSchema");
const walletSchema_1 = require("../../../model/expert/walletSchema");
class expertRepository extends baseRepository_1.BaseRepository {
    otpModel = otp_1.OTP;
    walletModel = walletSchema_1.ExpertWallet;
    constructor() {
        super(expertSchema_1.Expert);
    }
    async findExpertByEmail(email) {
        return this.model.findOne({ email });
    }
    async registerExpert(expertData) {
        return this.create(expertData);
    }
    async resetPassword(email, hashedPassword) {
        const currentUser = await this.model.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
        return currentUser;
    }
    async storeOtp(email, otp) {
        const storedOTP = await this.otpModel.create({ email, otp });
        return storedOTP;
    }
    async findOtp(email) {
        const otp = await this.otpModel.findOne({ email: email });
        return otp;
    }
    async storeResendOtp(email, otp) {
        await otp_1.OTP.findOneAndDelete({ email });
        const newOTP = await this.otpModel.create({ email, otp });
        return newOTP;
    }
    async updateDetails(expertDetails) {
        const { email, ...updateData } = expertDetails;
        const updatedExpert = await this.model.findOneAndUpdate({ email }, { $set: { ...updateData, isVerified: "Pending" } }, { new: true });
        return updatedExpert;
    }
    async getExpertById(expertId) {
        const expert = await this.model.findOne({ _id: expertId });
        return expert;
    }
    async updateExpertById(expertId, updateData) {
        return this.findByIdAndUpdate(expertId, updateData);
    }
    async getWalletById(expertId) {
        const user = await this.walletModel.findOne({ expertId: expertId });
        return user;
    }
}
exports.default = expertRepository;
//# sourceMappingURL=expertRepository.js.map
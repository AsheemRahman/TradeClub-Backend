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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../base/implementation/baseRepository");
const otp_1 = require("../../../model/user/otp");
const expertSchema_1 = require("../../../model/expert/expertSchema");
const walletSchema_1 = require("../../../model/expert/walletSchema");
class expertRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(expertSchema_1.Expert);
        this.otpModel = otp_1.OTP;
        this.walletModel = walletSchema_1.ExpertWallet;
    }
    findExpertByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ email });
        });
    }
    registerExpert(expertData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(expertData);
        });
    }
    resetPassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.model.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
            return currentUser;
        });
    }
    storeOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOTP = yield this.otpModel.create({ email, otp });
            return storedOTP;
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this.otpModel.findOne({ email: email });
            return otp;
        });
    }
    storeResendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otp_1.OTP.findOneAndDelete({ email });
            const newOTP = yield this.otpModel.create({ email, otp });
            return newOTP;
        });
    }
    updateDetails(expertDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = expertDetails, updateData = __rest(expertDetails, ["email"]);
            const updatedExpert = yield this.model.findOneAndUpdate({ email }, { $set: Object.assign(Object.assign({}, updateData), { isVerified: "Pending" }) }, { new: true });
            return updatedExpert;
        });
    }
    getExpertById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield this.model.findOne({ _id: expertId });
            return expert;
        });
    }
    updateExpertById(expertId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findByIdAndUpdate(expertId, updateData);
        });
    }
    getWalletById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.walletModel.findOne({ expertId: expertId });
            return user;
        });
    }
}
exports.default = expertRepository;

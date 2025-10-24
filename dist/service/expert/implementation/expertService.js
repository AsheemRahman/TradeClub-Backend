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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passwordUtils_1 = __importDefault(require("../../../utils/passwordUtils"));
class ExpertService {
    constructor(userRepository) {
        this._expertRepository = userRepository;
    }
    findExpertByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._expertRepository.findExpertByEmail(email);
            return user;
        });
    }
    registerExpert(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userData.password) {
                const hashedPassword = yield passwordUtils_1.default.passwordHash(userData.password);
                userData.password = hashedPassword;
            }
            return yield this._expertRepository.registerExpert(userData);
        });
    }
    resetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield passwordUtils_1.default.passwordHash(password);
            return yield this._expertRepository.resetPassword(email, hashedPassword);
        });
    }
    storeOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield this._expertRepository.storeOtp(email, otp);
            return storedOtp;
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this._expertRepository.findOtp(email);
            return otp;
        });
    }
    storeResendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const resendOTP = yield this._expertRepository.storeResendOtp(email, otp);
            return resendOTP;
        });
    }
    updateDetails(expertDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const expertDetail = yield this._expertRepository.updateDetails(expertDetails);
            return expertDetail;
        });
    }
    getExpertById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._expertRepository.getExpertById(expertId);
            return user;
        });
    }
    ;
    updateExpertById(expertId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedExpert = yield this._expertRepository.updateExpertById(expertId, updateData);
            return updatedExpert;
        });
    }
    ;
    getWalletById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._expertRepository.getWalletById(expertId);
            return wallet;
        });
    }
    ;
}
exports.default = ExpertService;

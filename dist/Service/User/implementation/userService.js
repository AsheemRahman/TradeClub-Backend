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
const userMapper_1 = require("../../../mapper/userMapper");
const otpMapper_1 = require("../../../mapper/otpMapper");
class UserService {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }
    ;
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findUser(email);
            return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
        });
    }
    ;
    validateUserCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findUser(email);
            if (!user || !user.password)
                return null;
            const isPasswordValid = yield passwordUtils_1.default.comparePassword(password, user.password);
            if (!isPasswordValid)
                return null;
            return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
        });
    }
    ;
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEntity = userMapper_1.UserMapper.toEntity(userData);
            if (userEntity.password) {
                userEntity.password = yield passwordUtils_1.default.passwordHash(userEntity.password);
            }
            const newUser = yield this._userRepository.registerUser(userEntity);
            return newUser ? userMapper_1.UserMapper.toResponseDTO(newUser) : null;
        });
    }
    ;
    resetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield passwordUtils_1.default.passwordHash(password);
            const user = yield this._userRepository.resetPassword(email, hashedPassword);
            return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
        });
    }
    ;
    storeOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpEntity = otpMapper_1.OtpMapper.toEntity({ email, otp });
            const storedOtp = yield this._userRepository.storeOtp(email, +(otpEntity.otp));
            return storedOtp ? otpMapper_1.OtpMapper.toResponseDTO(storedOtp) : null;
        });
    }
    ;
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this._userRepository.findOtp(email);
            return otp ? otpMapper_1.OtpMapper.toResponseDTO(otp) : null;
        });
    }
    ;
    storeResendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpEntity = otpMapper_1.OtpMapper.toEntity({ email, otp });
            const resendOtp = yield this._userRepository.storeResendOtp(email, +(otpEntity.otp));
            return resendOtp ? otpMapper_1.OtpMapper.toResponseDTO(resendOtp) : null;
        });
    }
    ;
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.getUserById(userId);
            return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
        });
    }
    ;
    updateUserById(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEntity = userMapper_1.UserMapper.updateEntity(updateData);
            if (userEntity.password) {
                userEntity.password = yield passwordUtils_1.default.passwordHash(userEntity.password);
            }
            const updatedUser = yield this._userRepository.updateUserById(userId, userEntity);
            return updatedUser ? userMapper_1.UserMapper.toResponseDTO(updatedUser) : null;
        });
    }
    ;
    fetchPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const planData = yield this._userRepository.fetchPlans();
            return planData;
        });
    }
    getAllExpert() {
        return __awaiter(this, void 0, void 0, function* () {
            const experts = yield this._userRepository.getAllExpert();
            return experts;
        });
    }
    getExpertById(ExpertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield this._userRepository.getExpertById(ExpertId);
            return expert;
        });
    }
    getAvailabilityByExpert(availabilityId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const availability = yield this._userRepository.getAvailabilityByExpert(availabilityId, startDate, endDate);
            return availability;
        });
    }
    checkSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this._userRepository.checkSubscription(userId);
            return subscription;
        });
    }
    getSessions(userId, page, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const filters = { userId };
            if (status && status !== 'all') {
                filters.status = status;
            }
            const [sessions, total] = yield Promise.all([this._userRepository.findSessions(filters, skip, limit), this._userRepository.countSessions(filters),]);
            return { sessions, total, limit, page, };
        });
    }
    getSessionById(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._userRepository.getSessionById(sessionId);
            return session;
        });
    }
    ;
}
exports.default = UserService;

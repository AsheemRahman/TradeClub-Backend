"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passwordUtils_1 = __importDefault(require("../../../utils/passwordUtils"));
const userMapper_1 = require("../../../mapper/userMapper");
const otpMapper_1 = require("../../../mapper/otpMapper");
class UserService {
    _userRepository;
    constructor(userRepository) {
        this._userRepository = userRepository;
    }
    ;
    async findUser(email) {
        const user = await this._userRepository.findUser(email);
        return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
    }
    ;
    async validateUserCredentials(email, password) {
        const user = await this._userRepository.findUser(email);
        if (!user || !user.password)
            return null;
        const isPasswordValid = await passwordUtils_1.default.comparePassword(password, user.password);
        if (!isPasswordValid)
            return null;
        return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
    }
    ;
    async registerUser(userData) {
        const userEntity = userMapper_1.UserMapper.toEntity(userData);
        if (userEntity.password) {
            userEntity.password = await passwordUtils_1.default.passwordHash(userEntity.password);
        }
        const newUser = await this._userRepository.registerUser(userEntity);
        return newUser ? userMapper_1.UserMapper.toResponseDTO(newUser) : null;
    }
    ;
    async resetPassword(email, password) {
        const hashedPassword = await passwordUtils_1.default.passwordHash(password);
        const user = await this._userRepository.resetPassword(email, hashedPassword);
        return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
    }
    ;
    async storeOtp(email, otp) {
        const otpEntity = otpMapper_1.OtpMapper.toEntity({ email, otp });
        const storedOtp = await this._userRepository.storeOtp(email, +(otpEntity.otp));
        return storedOtp ? otpMapper_1.OtpMapper.toResponseDTO(storedOtp) : null;
    }
    ;
    async findOtp(email) {
        const otp = await this._userRepository.findOtp(email);
        return otp ? otpMapper_1.OtpMapper.toResponseDTO(otp) : null;
    }
    ;
    async storeResendOtp(email, otp) {
        const otpEntity = otpMapper_1.OtpMapper.toEntity({ email, otp });
        const resendOtp = await this._userRepository.storeResendOtp(email, +(otpEntity.otp));
        return resendOtp ? otpMapper_1.OtpMapper.toResponseDTO(resendOtp) : null;
    }
    ;
    async getUserById(userId) {
        const user = await this._userRepository.getUserById(userId);
        return user ? userMapper_1.UserMapper.toResponseDTO(user) : null;
    }
    ;
    async updateUserById(userId, updateData) {
        const userEntity = userMapper_1.UserMapper.updateEntity(updateData);
        if (userEntity.password) {
            userEntity.password = await passwordUtils_1.default.passwordHash(userEntity.password);
        }
        const updatedUser = await this._userRepository.updateUserById(userId, userEntity);
        return updatedUser ? userMapper_1.UserMapper.toResponseDTO(updatedUser) : null;
    }
    ;
    async fetchPlans() {
        const planData = await this._userRepository.fetchPlans();
        return planData;
    }
    async getAllExpert() {
        const experts = await this._userRepository.getAllExpert();
        return experts;
    }
    async getExpertById(ExpertId) {
        const expert = await this._userRepository.getExpertById(ExpertId);
        return expert;
    }
    async getAvailabilityByExpert(availabilityId, startDate, endDate) {
        const availability = await this._userRepository.getAvailabilityByExpert(availabilityId, startDate, endDate);
        return availability;
    }
    async checkSubscription(userId) {
        const subscription = await this._userRepository.checkSubscription(userId);
        return subscription;
    }
    async getSessions(userId, page, limit, status) {
        const skip = (page - 1) * limit;
        const filters = { userId };
        if (status && status !== 'all') {
            filters.status = status;
        }
        const [sessions, total] = await Promise.all([this._userRepository.findSessions(filters, skip, limit), this._userRepository.countSessions(filters),]);
        return { sessions, total, limit, page, };
    }
    async getSessionById(sessionId) {
        const session = await this._userRepository.getSessionById(sessionId);
        return session;
    }
    ;
}
exports.default = UserService;
//# sourceMappingURL=userService.js.map
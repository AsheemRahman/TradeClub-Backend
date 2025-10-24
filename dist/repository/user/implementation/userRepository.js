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
const userSchema_1 = require("../../../model/user/userSchema");
const baseRepository_1 = require("../../base/implementation/baseRepository");
const otp_1 = require("../../../model/user/otp");
const subscriptionSchema_1 = require("../../../model/admin/subscriptionSchema");
const expertSchema_1 = require("../../../model/expert/expertSchema");
const availabilitySchema_1 = require("../../../model/expert/availabilitySchema");
const userSubscriptionSchema_1 = require("../../../model/user/userSubscriptionSchema");
const sessionSchema_1 = require("../../../model/expert/sessionSchema");
class userRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(userSchema_1.User);
    }
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield userSchema_1.User.findOne({ email: email });
            return getUser;
        });
    }
    findManyUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userSchema_1.User.find({ isActive: true }, { select: '_id' });
            return users;
        });
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(userData);
        });
    }
    resetPassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield userSchema_1.User.findOne({ email });
            if (!currentUser)
                return null;
            currentUser.password = hashedPassword;
            yield currentUser.save();
            return currentUser;
        });
    }
    storeOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOTP = yield otp_1.OTP.create({ email, otp });
            return storedOTP;
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield otp_1.OTP.findOne({ email: email });
            return otp;
        });
    }
    storeResendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otp_1.OTP.findOneAndDelete({ email });
            const newOTP = yield otp_1.OTP.create({ email, otp });
            return newOTP;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userSchema_1.User.findOne({ _id: userId });
            return user;
        });
    }
    updateUserById(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userSchema_1.User.findByIdAndUpdate(userId, updateData, { new: true });
            return user;
        });
    }
    fetchPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield subscriptionSchema_1.SubscriptionPlan.find().sort({ createdAt: -1 });
            return plans;
        });
    }
    getAllExpert() {
        return __awaiter(this, void 0, void 0, function* () {
            const experts = yield expertSchema_1.Expert.find({ isActive: true, isVerified: "Approved", }).sort({ createdAt: -1 });
            return experts;
        });
    }
    getExpertById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield expertSchema_1.Expert.findOne({ _id: expertId, isActive: true, isVerified: "Approved", });
            return expert;
        });
    }
    getAvailabilityByExpert(expertId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield availabilitySchema_1.ExpertAvailability.find({
                expertId: expertId,
                date: { $gte: startDate, $lte: endDate },
                isBooked: false,
            }).sort({ date: 1 });
            return expert;
        });
    }
    checkSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield userSubscriptionSchema_1.UserSubscription.findOne({ user: userId, isActive: true, paymentStatus: 'paid', endDate: { $gt: new Date() }, }).populate("subscriptionPlan");
            return subscription;
        });
    }
    findSessions(filters, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return sessionSchema_1.Session.find(filters).skip(skip).limit(limit).sort({ date: -1 }).lean().populate('expertId availabilityId');
            ;
        });
    }
    countSessions(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return sessionSchema_1.Session.countDocuments(filters);
        });
    }
    getSessionById(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return sessionSchema_1.Session.findById(sessionId);
        });
    }
}
exports.default = userRepository;

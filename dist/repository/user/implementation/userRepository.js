"use strict";
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
    async findUser(email) {
        const getUser = await userSchema_1.User.findOne({ email: email });
        return getUser;
    }
    async findManyUser() {
        const users = await userSchema_1.User.find({ isActive: true }, { select: '_id' });
        return users;
    }
    async registerUser(userData) {
        return this.create(userData);
    }
    async resetPassword(email, hashedPassword) {
        const currentUser = await userSchema_1.User.findOne({ email });
        if (!currentUser)
            return null;
        currentUser.password = hashedPassword;
        await currentUser.save();
        return currentUser;
    }
    async storeOtp(email, otp) {
        const storedOTP = await otp_1.OTP.create({ email, otp });
        return storedOTP;
    }
    async findOtp(email) {
        const otp = await otp_1.OTP.findOne({ email: email });
        return otp;
    }
    async storeResendOtp(email, otp) {
        await otp_1.OTP.findOneAndDelete({ email });
        const newOTP = await otp_1.OTP.create({ email, otp });
        return newOTP;
    }
    async getUserById(userId) {
        const user = await userSchema_1.User.findOne({ _id: userId });
        return user;
    }
    async updateUserById(userId, updateData) {
        const user = await userSchema_1.User.findByIdAndUpdate(userId, updateData, { new: true });
        return user;
    }
    async fetchPlans() {
        const plans = await subscriptionSchema_1.SubscriptionPlan.find().sort({ createdAt: -1 });
        return plans;
    }
    async getAllExpert() {
        const experts = await expertSchema_1.Expert.find({ isActive: true, isVerified: "Approved", }).sort({ createdAt: -1 });
        return experts;
    }
    async getExpertById(expertId) {
        const expert = await expertSchema_1.Expert.findOne({ _id: expertId, isActive: true, isVerified: "Approved", });
        return expert;
    }
    async getAvailabilityByExpert(expertId, startDate, endDate) {
        const expert = await availabilitySchema_1.ExpertAvailability.find({
            expertId: expertId,
            date: { $gte: startDate, $lte: endDate },
            isBooked: false,
        }).sort({ date: 1 });
        return expert;
    }
    async checkSubscription(userId) {
        const subscription = await userSubscriptionSchema_1.UserSubscription.findOne({ user: userId, isActive: true, paymentStatus: 'paid', endDate: { $gt: new Date() }, }).populate("subscriptionPlan");
        return subscription;
    }
    async findSessions(filters, skip, limit) {
        return sessionSchema_1.Session.find(filters).skip(skip).limit(limit).sort({ date: -1 }).lean().populate('expertId availabilityId');
        ;
    }
    async countSessions(filters) {
        return sessionSchema_1.Session.countDocuments(filters);
    }
    async getSessionById(sessionId) {
        return sessionSchema_1.Session.findById(sessionId);
    }
}
exports.default = userRepository;
//# sourceMappingURL=userRepository.js.map
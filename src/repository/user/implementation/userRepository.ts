import IUserRepository from "../IUserRepository";
import { User, IUser } from "../../../model/user/userSchema";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import { IUserType } from "../../../types/IUser";
import { OTP, OTPType } from "../../../model/user/otp";
import { SubscriptionPlan, ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { Expert, IExpert } from "../../../model/expert/expertSchema";
import { ExpertAvailability, IExpertAvailability } from "../../../model/expert/AvailabilitySchema";
import { IUserSubscription, UserSubscription } from "../../../model/user/userSubscriptionSchema";
import { ISession, Session } from "../../../model/expert/sessionSchema";

class userRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User)
    }

    async findUser(email: string): Promise<IUser | null> {
        const getUser = await User.findOne({ email: email });
        return getUser;
    }

    async registerUser(userData: IUserType): Promise<IUser | null> {
        const newUser = await User.create(userData);
        return newUser;
    }

    async resetPassword(email: string, hashedPassword: string): Promise<IUser | null> {
        const currentUser = await User.findOne({ email });
        if (!currentUser) return null;
        currentUser.password = hashedPassword;
        await currentUser.save();
        return currentUser;
    }

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOTP = await OTP.create({ email, otp })
        return storedOTP;
    }

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await OTP.findOne({ email: email });
        return otp;
    }

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        await OTP.findOneAndDelete({ email });
        const newOTP = await OTP.create({ email, otp });
        return newOTP;
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await User.findOne({ _id: id });
        return user;
    }

    async updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        return user;
    }

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
        return plans;
    }

    async getAllExpert(): Promise<IExpert[] | null> {
        const experts = await Expert.find({ isActive: true, isVerified: "Approved", }).sort({ createdAt: -1 });
        return experts;
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const expert = await Expert.findOne({ _id: id, isActive: true, isVerified: "Approved", });
        return expert;
    }

    async getAvailabilityByExpert(id: string, startDate: string, endDate: string): Promise<IExpertAvailability[] | null> {
        const expert = await ExpertAvailability.find({
            expertId: id,
            date: { $gte: startDate, $lte: endDate },
            isBooked: false,
        }).sort({ date: 1 });
        return expert;
    }

    async checkSubscription(userId: string): Promise<IUserSubscription | null> {
        const subscription = await UserSubscription.findOne({ user: userId, isActive: true, paymentStatus: 'paid', endDate: { $gt: new Date() }, }).populate("subscriptionPlan");
        return subscription;
    }

    async findSessions(filters: any, skip: number, limit: number): Promise<ISession[] | []> {
        return Session.find(filters).skip(skip).limit(limit).sort({ date: -1 }).lean().populate('expertId availabilityId');;
    }

    async countSessions(filters: any): Promise<number> {
        return Session.countDocuments(filters);
    }

    async getSessionById(sessionId: string): Promise<ISession | null> {
        return Session.findById(sessionId)
    }
}

export default userRepository;
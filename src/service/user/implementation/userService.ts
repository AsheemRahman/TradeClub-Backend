
import IUserRepository from "../../../repository/user/IUserRepository";
import IUserService from "../IUserService";
import { ISessionsResponse, IUserType } from '../../../types/IUser'


import PasswordUtils from "../../../utils/passwordUtils";
import { OTPType } from "../../../model/user/otp";
import { IUser } from "../../../model/user/userSchema";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { IExpert } from "../../../model/expert/expertSchema";
import { IExpertAvailability } from "../../../model/expert/AvailabilitySchema";
import { IUserSubscription } from "../../../model/user/userSubscriptionSchema";
import { ISession } from "../../../model/expert/sessionSchema";



class UserService implements IUserService {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    };

    async findUser(email: string): Promise<IUser | null> {
        const user = await this._userRepository.findUser(email);
        return user;
    };

    async registerUser(userData: IUserType): Promise<any> {
        if (userData.password) {
            const hashedPassword = await PasswordUtils.passwordHash(userData.password);
            userData.password = hashedPassword;
        }
        return await this._userRepository.registerUser(userData);
    };

    async resetPassword(email: string, password: string): Promise<any> {
        const hashedPassword = await PasswordUtils.passwordHash(password);
        return await this._userRepository.resetPassword(email, hashedPassword);
    };

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOtp = await this._userRepository.storeOtp(email, otp);
        return storedOtp
    };

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await this._userRepository.findOtp(email);
        return otp;
    };

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        const resendOTP = await this._userRepository.storeResendOtp(email, otp);
        return resendOTP;
    };

    async getUserById(id: string): Promise<IUser | null> {
        const user = await this._userRepository.getUserById(id);
        return user;
    };

    async updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        if (updateData.password) {
            const hashedPassword = await PasswordUtils.passwordHash(updateData.password);
            updateData.password = hashedPassword;
        }
        const updatedUser = await this._userRepository.updateUserById(id, updateData);
        return updatedUser;
    };

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const planData = await this._userRepository.fetchPlans();
        return planData;
    }

    async getAllExpert(): Promise<IExpert[] | null> {
        const experts = await this._userRepository.getAllExpert();
        return experts;
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const expert = await this._userRepository.getExpertById(id);
        return expert;
    }

    async getAvailabilityByExpert(id: string, startDate: string, endDate: string): Promise<IExpertAvailability[] | null> {
        const availability = await this._userRepository.getAvailabilityByExpert(id, startDate, endDate);
        return availability;
    }

    async checkSubscription(userId: string): Promise<IUserSubscription | null> {
        const subscription = await this._userRepository.checkSubscription(userId);
        return subscription;
    }

    async getSessions(userId: string, page: number, limit: number, status: string): Promise<ISessionsResponse> {
        console.log("inside the service")
        const skip = (page - 1) * limit;
        const filters: any = { userId };
        if (status && status !== 'all') {
            filters.status = status;
        }
        const [sessions, total] = await Promise.all([this._userRepository.findSessions(filters, skip, limit), this._userRepository.countSessions(filters),]);
        return { sessions, total, limit, page, };
    }
}


export default UserService;

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
import { UserMapper } from "../../../mapper/userMapper";
import { UserResponseDTO } from "../../../dto/userDTO";
import { OtpMapper } from "../../../mapper/otpMapper";
import { OtpResponseDTO } from "../../../dto/otpDTO";


class UserService implements IUserService {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    };

    async findUser(email: string): Promise<UserResponseDTO | null> {
        const user = await this._userRepository.findUser(email);
        return user ? UserMapper.toResponseDTO(user) : null;
    };

    async validateUserCredentials(email: string, password: string): Promise<UserResponseDTO | null> {
        const user = await this._userRepository.findUser(email);
        if (!user || !user.password) return null;
        const isPasswordValid = await PasswordUtils.comparePassword(password, user.password);
        if (!isPasswordValid) return null;
        return user ? UserMapper.toResponseDTO(user) : null;
    };

    async registerUser(userData: IUserType): Promise<UserResponseDTO | null> {
        const userEntity = UserMapper.toEntity(userData);
        if (userEntity.password) {
            userEntity.password = await PasswordUtils.passwordHash(userEntity.password);
        }
        const newUser = await this._userRepository.registerUser(userEntity);
        return newUser ? UserMapper.toResponseDTO(newUser) : null;
    };

    async resetPassword(email: string, password: string): Promise<UserResponseDTO | null> {
        const hashedPassword = await PasswordUtils.passwordHash(password);
        const user = await this._userRepository.resetPassword(email, hashedPassword);
        return user ? UserMapper.toResponseDTO(user) : null;
    };

    async storeOtp(email: string, otp: number): Promise<OtpResponseDTO | null> {
        const otpEntity: Partial<OTPType> = OtpMapper.toEntity({ email, otp });
        const storedOtp = await this._userRepository.storeOtp(email, +(otpEntity.otp!));
        return storedOtp ? OtpMapper.toResponseDTO(storedOtp) : null;
    };

    async findOtp(email: string): Promise<OtpResponseDTO | null> {
        const otp = await this._userRepository.findOtp(email);
        return otp ? OtpMapper.toResponseDTO(otp) : null;
    };

    async storeResendOtp(email: string, otp: number): Promise<OtpResponseDTO | null> {
        const otpEntity: Partial<OTPType> = OtpMapper.toEntity({ email, otp });
        const resendOtp = await this._userRepository.storeResendOtp(email, +(otpEntity.otp!));
        return resendOtp ? OtpMapper.toResponseDTO(resendOtp) : null;
    };

    async getUserById(userId: string): Promise<UserResponseDTO | null> {
        const user = await this._userRepository.getUserById(userId);
        return user ? UserMapper.toResponseDTO(user) : null;
    };

    async updateUserById(userId: string, updateData: Partial<IUser>): Promise<UserResponseDTO | null> {
        const userEntity = UserMapper.updateEntity(updateData);
        if (userEntity.password) {
            userEntity.password = await PasswordUtils.passwordHash(userEntity.password);
        }
        const updatedUser = await this._userRepository.updateUserById(userId, userEntity);
        return updatedUser ? UserMapper.toResponseDTO(updatedUser) : null;
    };

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const planData = await this._userRepository.fetchPlans();
        return planData;
    }

    async getAllExpert(): Promise<IExpert[] | null> {
        const experts = await this._userRepository.getAllExpert();
        return experts;
    }

    async getExpertById(ExpertId: string): Promise<IExpert | null> {
        const expert = await this._userRepository.getExpertById(ExpertId);
        return expert;
    }

    async getAvailabilityByExpert(availabilityId: string, startDate: string, endDate: string): Promise<IExpertAvailability[] | null> {
        const availability = await this._userRepository.getAvailabilityByExpert(availabilityId, startDate, endDate);
        return availability;
    }

    async checkSubscription(userId: string): Promise<IUserSubscription | null> {
        const subscription = await this._userRepository.checkSubscription(userId);
        return subscription;
    }

    async getSessions(userId: string, page: number, limit: number, status: string): Promise<ISessionsResponse> {
        const skip = (page - 1) * limit;
        const filters: any = { userId };
        if (status && status !== 'all') {
            filters.status = status;
        }
        const [sessions, total] = await Promise.all([this._userRepository.findSessions(filters, skip, limit), this._userRepository.countSessions(filters),]);
        return { sessions, total, limit, page, };
    }

    async getSessionById(sessionId: string): Promise<ISession | null> {
        const session = await this._userRepository.getSessionById(sessionId);
        return session
    };
}


export default UserService;
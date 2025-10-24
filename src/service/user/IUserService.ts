import { OtpResponseDTO } from '../../dto/otpDTO';
import { UserResponseDTO } from '../../dto/userDTO';
import { ISubscriptionPlan } from '../../model/admin/subscriptionSchema';
import { IExpertAvailability } from '../../model/expert/availabilitySchema';
import { IExpert } from '../../model/expert/expertSchema';
import { ISession } from '../../model/expert/sessionSchema';
import { OTPType } from '../../model/user/otp';
import { IUser } from '../../model/user/userSchema';
import { IUserSubscription } from '../../model/user/userSubscriptionSchema';
import { ISessionsResponse, IUserType } from '../../types/IUser';


interface IUserService {
    findUser(email: string): Promise<UserResponseDTO | null>;
    validateUserCredentials(email: string, password: string): Promise<UserResponseDTO | null>;
    registerUser(userData: IUserType): Promise<UserResponseDTO | null>;
    resetPassword(email: string, password: string): Promise<UserResponseDTO | null>;

    storeOtp(email: string, otp: number): Promise<OtpResponseDTO | null>;
    findOtp(email: string): Promise<OtpResponseDTO | null>;
    storeResendOtp(email: string, otp: number): Promise<OtpResponseDTO | null>;

    getUserById(userId: string): Promise<UserResponseDTO | null>;
    updateUserById(userId: string, updateData: Partial<IUser>): Promise<UserResponseDTO | null>;

    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getAllExpert(): Promise<IExpert[] | null>;
    getExpertById(expertId: string): Promise<IExpert | null>;
    getAvailabilityByExpert(id: string, startDate: string, endDate: string): Promise<IExpertAvailability[] | null>;
    checkSubscription(userId: string): Promise<IUserSubscription | null>;

    getSessions(userId: string, page: number, limit: number, status: string): Promise<ISessionsResponse>;
    getSessionById(sessionId: string): Promise<ISession | null>;
}

export default IUserService;
import { ISubscriptionPlan } from '../../model/admin/subscriptionSchema';
import { IExpertAvailability } from '../../model/expert/AvailabilitySchema';
import { IExpert } from '../../model/expert/expertSchema';
import { ISession } from '../../model/expert/sessionSchema';
import { OTPType } from '../../model/user/otp';
import { IUser } from '../../model/user/userSchema';
import { IUserSubscription } from '../../model/user/userSubscriptionSchema';
import { ISessionsResponse, IUserType } from '../../types/IUser';


interface IUserService {
    findUser(email: string): Promise<IUser | null>;
    registerUser(userData: IUserType): Promise<IUser | null>;
    resetPassword(email: string, password: string): Promise<IUser | null>;

    storeOtp(email: string, otp: number): Promise<OTPType | null>;
    findOtp(email: string): Promise<OTPType | null>;
    storeResendOtp(email: string, otp: number): Promise<OTPType | null>;

    getUserById(id: string): Promise<IUser | null>;
    updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null>;

    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getAllExpert(): Promise<IExpert[] | null>;
    getExpertById(id: string): Promise<IExpert | null>;
    getAvailabilityByExpert(id: string, startDate: string, endDate: string): Promise<IExpertAvailability[] | null>;
    checkSubscription(userId: string): Promise<IUserSubscription | null>;

    getSessions(userId: string, page: number, limit: number, status: string): Promise<ISessionsResponse>;
    getSessionById(sessionId: string): Promise<ISession | null>;
}

export default IUserService;
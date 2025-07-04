
import IUserRepository from "../../../repository/user/IUserRepository";
import IUserService from "../IUserService";
import { IUserType } from '../../../types/IUser'


import PasswordUtils from "../../../utils/passwordUtils";
import { OTPType } from "../../../model/user/otp";
import { IUser } from "../../../model/user/userSchema";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";



class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    };

    async findUser(email: string): Promise<IUser | null> {
        const user = await this.userRepository.findUser(email);
        return user;
    };

    async registerUser(userData: IUserType): Promise<any> {
        if (userData.password) {
            const hashedPassword = await PasswordUtils.passwordHash(userData.password);
            userData.password = hashedPassword;
        }
        return await this.userRepository.registerUser(userData);
    };

    async resetPassword(email: string, password: string): Promise<any> {
        const hashedPassword = await PasswordUtils.passwordHash(password);
        return await this.userRepository.resetPassword(email, hashedPassword);
    };

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOtp = await this.userRepository.storeOtp(email, otp);
        return storedOtp
    };

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await this.userRepository.findOtp(email);
        return otp;
    };

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        const resendOTP = await this.userRepository.storeResendOtp(email, otp);
        return resendOTP;
    };

    async getUserById(id: string): Promise<IUser | null> {
        const user = await this.userRepository.getUserById(id);
        return user;
    };

    async updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        if (updateData.password) {
            const hashedPassword = await PasswordUtils.passwordHash(updateData.password);
            updateData.password = hashedPassword;
        }
        const updatedUser = await this.userRepository.updateUserById(id, updateData);
        return updatedUser;
    };

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const planData = await this.userRepository.fetchPlans();
        return planData;
    }
}


export default UserService;
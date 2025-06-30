import IExpertRepository from "../IExpertRepository";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import { IUserType } from "../../../types/IUser";
import { OTP, OTPType } from "../../../model/user/otp";
import { Expert, IExpert } from "../../../model/expert/expertSchema";
import { ExpertFormData } from "../../../types/IExpert";
import { ExpertWallet, IExpertWallet } from "../../../model/expert/walletSchema";

class expertRepository extends BaseRepository<IExpert> implements IExpertRepository {
    constructor() {
        super(Expert)
    }

    async findExpertByEmail(email: string): Promise<IExpert | null> {
        const getUser = await Expert.findOne({ email: email });
        return getUser;
    }

    async registerExpert(userData: IUserType): Promise<IExpert | null> {
        const newUser = await Expert.create(userData);
        return newUser;
    }

    async resetPassword(email: string, hashedPassword: string): Promise<IExpert | null> {
        const currentUser = await Expert.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
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

    async updateDetails(expertDetails: ExpertFormData): Promise<IExpert | null> {
        const { email, ...updateData } = expertDetails;
        const updatedExpert = await Expert.findOneAndUpdate({ email }, { $set: { ...updateData, isVerified: "Pending" } }, { new: true });
        return updatedExpert;
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const user = await Expert.findOne({ _id: id });
        return user;
    }

    async updateExpertById(id: string, updateData: Partial<IExpert>): Promise<IExpert | null> {
        const user = await Expert.findByIdAndUpdate(id, updateData, { new: true });
        return user;
    }

    async getWalletById(id: string): Promise<IExpertWallet | null> {
        const user = await ExpertWallet.findOne({ expertId: id });
        return user;
    }
}

export default expertRepository;
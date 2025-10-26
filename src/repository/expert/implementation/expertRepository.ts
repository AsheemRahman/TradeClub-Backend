import IExpertRepository from "../IExpertRepository";
import { BaseRepository } from "../../base/implementation/baseRepository";
import { IUserType } from "../../../types/IUser";
import { OTP, OTPType } from "../../../model/user/otp";
import { Expert, IExpert } from "../../../model/expert/expertSchema";
import { ExpertFormData } from "../../../types/IExpert";
import { ExpertWallet, IExpertWallet } from "../../../model/expert/walletSchema";

class expertRepository extends BaseRepository<IExpert> implements IExpertRepository {
    private otpModel = OTP;
    private walletModel = ExpertWallet;

    constructor() {
        super(Expert)
    }

    async findExpertByEmail(email: string): Promise<IExpert | null> {
        return Expert.findOne({ email });
    }

    async registerExpert(expertData: IUserType): Promise<IExpert | null> {
        return this.create(expertData);
    }

    async resetPassword(email: string, hashedPassword: string): Promise<IExpert | null> {
        const currentUser = await this.model.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
        return currentUser;
    }

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOTP = await this.otpModel.create({ email, otp })
        return storedOTP;
    }

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await this.otpModel.findOne({ email: email });
        return otp;
    }

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        await OTP.findOneAndDelete({ email });
        const newOTP = await this.otpModel.create({ email, otp });
        return newOTP;
    }

    async updateDetails(expertDetails: ExpertFormData): Promise<IExpert | null> {
        const { email, ...updateData } = expertDetails;
        const updatedExpert = await this.model.findOneAndUpdate({ email }, { $set: { ...updateData, isVerified: "Pending" } }, { new: true });
        return updatedExpert;
    }

    async getExpertById(expertId: string): Promise<IExpert | null> {
        const expert = await this.model.findOne({ _id: expertId });
        return expert;
    }

    async updateExpertById(expertId: string, updateData: Partial<IExpert>): Promise<IExpert | null> {
        return this.findByIdAndUpdate(expertId, updateData);
    }

    async getWalletById(expertId: string): Promise<IExpertWallet | null> {
        const user = await this.walletModel.findOne({ expertId: expertId });
        return user;
    }
}

export default expertRepository;
import { IExpert } from "../model/expert/expertSchema";

import { ExpertResponseDTO, CreateExpertDTO, UpdateExpertDTO } from "../dto/expertDTO";


export class ExpertMapper {

    static toResponseDTO(expert: any): ExpertResponseDTO {
        return {
            id: expert._id.toString(),
            fullName: expert.fullName,
            email: expert.email,
            phoneNumber: expert.phoneNumber,
            profilePicture: expert.profilePicture,
            DOB: expert.DOB,
            state: expert.state,
            country: expert.country,
            experience_level: expert.experience_level,
            year_of_experience: expert.year_of_experience,
            markets_Traded: expert.markets_Traded,
            trading_style: expert.trading_style,
            proof_of_experience: expert.proof_of_experience,
            Introduction_video: expert.Introduction_video,
            Government_Id: expert.Government_Id,
            selfie_Id: expert.selfie_Id,
            stripeAccountId: expert.stripeAccountId,
            isActive: expert.isActive ?? true,
            isVerified: expert.isVerified ?? "Pending",
            createdAt: expert.createdAt!,
        };
    }

    static toEntity(dto: CreateExpertDTO | UpdateExpertDTO): Partial<IExpert> {
        return {
            fullName: dto.fullName,
            email: dto.email,
            password: dto.password,
            phoneNumber: dto.phoneNumber,
            profilePicture: dto.profilePicture,
            DOB: dto.DOB,
            state: dto.state,
            country: dto.country,
            experience_level: dto.experience_level,
            year_of_experience: dto.year_of_experience,
            markets_Traded: dto.markets_Traded,
            trading_style: dto.trading_style,
            proof_of_experience: dto.proof_of_experience,
            Introduction_video: dto.Introduction_video,
            Government_Id: dto.Government_Id,
            selfie_Id: dto.selfie_Id,
            stripeAccountId: dto.stripeAccountId,
            isActive: (dto as UpdateExpertDTO).isActive,
            isVerified: (dto as UpdateExpertDTO).isVerified,
        };
    }

}

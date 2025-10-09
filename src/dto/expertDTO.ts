export interface CreateExpertDTO {
    fullName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    profilePicture?: string;
    DOB?: Date;
    state?: string;
    country?: string;
    experience_level?: 'Beginner' | 'Intermediate' | 'Expert';
    year_of_experience?: number;
    markets_Traded?: 'Stock' | 'Forex' | 'Crypto' | 'Commodities';
    trading_style?: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
    proof_of_experience?: string;
    Introduction_video?: string;
    Government_Id?: string;
    selfie_Id?: string;
    stripeAccountId?: string;
}

export interface UpdateExpertDTO {
    fullName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    profilePicture?: string;
    DOB?: Date;
    state?: string;
    country?: string;
    experience_level?: 'Beginner' | 'Intermediate' | 'Expert';
    year_of_experience?: number;
    markets_Traded?: 'Stock' | 'Forex' | 'Crypto' | 'Commodities';
    trading_style?: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
    proof_of_experience?: string;
    Introduction_video?: string;
    Government_Id?: string;
    selfie_Id?: string;
    stripeAccountId?: string;
    isActive?: boolean;
    isVerified?: "Approved" | "Pending" | "Declined";
}

export interface ExpertResponseDTO {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
    DOB?: Date;
    state?: string;
    country?: string;
    experience_level?: 'Beginner' | 'Intermediate' | 'Expert';
    year_of_experience?: number;
    markets_Traded?: 'Stock' | 'Forex' | 'Crypto' | 'Commodities';
    trading_style?: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
    proof_of_experience?: string;
    Introduction_video?: string;
    Government_Id?: string;
    selfie_Id?: string;
    stripeAccountId?: string;
    isActive: boolean;
    isVerified: "Approved" | "Pending" | "Declined";
    createdAt: Date;
}
export interface CreateUserDTO {
    fullName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    profilePicture?: string;
}

export interface UpdateUserDTO {
    fullName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    profilePicture?: string;
    isActive?: boolean;
}

export interface UserResponseDTO {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
    isActive: boolean;
    lastSeen: Date | null;
    createdAt: Date;
}
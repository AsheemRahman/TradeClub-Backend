import { IUser } from "../model/user/userSchema";
import { UserResponseDTO, CreateUserDTO, UpdateUserDTO } from "../dto/userDTO";

export class UserMapper {
    static toResponseDTO(user : any ): UserResponseDTO {
        return {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email!,
            phoneNumber: user.phoneNumber?.toString(),
            profilePicture: user.profilePicture,
            isActive: user.isActive ?? true,
            lastSeen: user.lastSeen ?? null,
            createdAt: user.createdAt!,
        };
    }

    static toEntity(createDto: CreateUserDTO): Partial<IUser> {
        return {
            fullName: createDto.fullName,
            email: createDto.email,
            password: createDto.password,
            phoneNumber: createDto.phoneNumber,
            profilePicture: createDto.profilePicture,
        };
    }

    static updateEntity(updateDto: UpdateUserDTO): Partial<IUser> {
        return {
            fullName: updateDto.fullName,
            email: updateDto.email,
            password: updateDto.password,
            phoneNumber: updateDto.phoneNumber,
            profilePicture: updateDto.profilePicture,
            isActive: updateDto.isActive,
        };
    }
}

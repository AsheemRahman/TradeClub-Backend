"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toResponseDTO(user) {
        return {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber?.toString(),
            profilePicture: user.profilePicture,
            isActive: user.isActive ?? true,
            lastSeen: user.lastSeen ?? null,
            createdAt: user.createdAt,
        };
    }
    static toEntity(createDto) {
        return {
            fullName: createDto.fullName,
            email: createDto.email,
            password: createDto.password,
            phoneNumber: createDto.phoneNumber,
            profilePicture: createDto.profilePicture,
        };
    }
    static updateEntity(updateDto) {
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
exports.UserMapper = UserMapper;
//# sourceMappingURL=userMapper.js.map
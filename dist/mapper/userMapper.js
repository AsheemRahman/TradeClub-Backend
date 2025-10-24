"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toResponseDTO(user) {
        var _a, _b, _c;
        return {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            phoneNumber: (_a = user.phoneNumber) === null || _a === void 0 ? void 0 : _a.toString(),
            profilePicture: user.profilePicture,
            isActive: (_b = user.isActive) !== null && _b !== void 0 ? _b : true,
            lastSeen: (_c = user.lastSeen) !== null && _c !== void 0 ? _c : null,
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

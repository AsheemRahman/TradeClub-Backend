"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMapper = void 0;
class SessionMapper {
    static toSessionResponseDTO(session) {
        return {
            id: session.id.toString(),
            userId: session.userId.toString(),
            expertId: session.expertId.toString(),
            availabilityId: session.availabilityId.toString(),
            meetingLink: session.meetingLink,
            status: session.status,
            bookedAt: session.bookedAt,
            startTime: session.startTime,
            createdAt: session.createdAt,
        };
    }
    static toSessionEntity(dto) {
        return {
            userId: dto.userId,
            expertId: dto.expertId,
            availabilityId: dto.availabilityId,
            meetingLink: dto.meetingLink,
            status: dto.status,
            bookedAt: dto.bookedAt,
            startTime: dto.startTime,
        };
    }
}
exports.SessionMapper = SessionMapper;

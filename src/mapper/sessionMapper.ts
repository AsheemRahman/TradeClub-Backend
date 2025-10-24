import { ISession } from "../model/expert/sessionSchema";
import { SessionResponseDTO, CreateSessionDTO, UpdateSessionDTO } from "../dto/sessionDTO";
import { sessionType } from "../types/IShared";


export class SessionMapper {

    static toSessionResponseDTO(session: sessionType): SessionResponseDTO {
        return {
            id: session.id.toString(),
            userId: session.userId.toString(),
            expertId: session.expertId.toString(),
            availabilityId: session.availabilityId.toString(),
            meetingLink: session.meetingLink,
            status: session.status,
            bookedAt: session.bookedAt,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            createdAt: session.createdAt!,
        };
    }

    static toSessionEntity(dto: CreateSessionDTO | UpdateSessionDTO): Partial<ISession> {
        return {
            userId: (dto as CreateSessionDTO).userId,
            expertId: (dto as CreateSessionDTO).expertId,
            availabilityId: (dto as CreateSessionDTO).availabilityId,
            meetingLink: dto.meetingLink,
            status: dto.status,
            bookedAt: (dto as CreateSessionDTO).bookedAt,
            startedAt: dto.startedAt,
            endedAt: dto.endedAt,
        };
    }

}

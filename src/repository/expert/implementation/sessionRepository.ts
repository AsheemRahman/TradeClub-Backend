import { BaseRepository } from "../../base/implementation/BaseRepository";
import { Expert, IExpert } from "../../../model/expert/expertSchema";
import ISessionRepository from "../ISessionRepository";


class SessionRepository extends BaseRepository<IExpert> implements ISessionRepository {
    constructor() {
        super(Expert)
    }

}

export default SessionRepository;
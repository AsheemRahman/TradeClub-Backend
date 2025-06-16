import IProfileRepository from "../IProfileRepository";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import { Expert, IExpert } from "../../../model/expert/expertSchema";


class ProfileRepository extends BaseRepository<IExpert> implements IProfileRepository {
    constructor() {
        super(Expert)
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const user = await Expert.findOne({ _id: id });
        return user;
    }
}

export default ProfileRepository;
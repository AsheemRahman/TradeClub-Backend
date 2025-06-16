
import { IExpert } from "../../../model/expert/expertSchema";
import IProfileRepository from "../../../repository/expert/IProfileRepository";
import IProfileService from "../IProfileService";



class ProfileService implements IProfileService {
    private profileRepository: IProfileRepository;

    constructor(profileRepository: IProfileRepository) {
        this.profileRepository = profileRepository;
    }
    async getExpertById(id: string): Promise<IExpert | null> {
        const user = await this.profileRepository.getExpertById(id);
        return user;
    };

}


export default ProfileService;
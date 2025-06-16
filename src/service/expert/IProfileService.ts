import { IExpert } from "../../model/expert/expertSchema";

interface IProfileService {
    getExpertById(id: string): Promise<IExpert | null>;
}

export default IProfileService;
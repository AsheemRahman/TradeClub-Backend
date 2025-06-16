import { IExpert } from "../../model/expert/expertSchema";

interface IProfileRepository {
    getExpertById(id: string): Promise<IExpert | null>;
}


export default IProfileRepository;
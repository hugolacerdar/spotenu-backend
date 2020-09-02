import UserDB from "../data/UserDB";
import User, { UserRole } from "../model/User";
import Cypher from "../services/Cypher";
import NotFoundError from "../error/NotFoundError";

export default class GetBandsBusiness {
    constructor(
        private userDB: UserDB,
    ) { }

    public async execute(): Promise<GetBandsBusinessOutput[]> {

        const bands = await this.userDB.getAllBands();
        
        if (!bands) {
            throw new NotFoundError("No bands found");
        }

        return bands;
    }
}

export interface GetBandsBusinessOutput {
    name: string,
    email: string,
    username: string,
    isApproved: boolean
}
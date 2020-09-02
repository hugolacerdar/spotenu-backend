import UserDB from "../data/UserDB";
import User, { UserRole } from "../model/User";
import NotFoundError from "../error/NotFoundError";
import InvalidInput from "../error/InvalidInput";

export default class ApproveBandBusiness {
    constructor(
        private userDB: UserDB,
    ) { }

    public async execute(id: string): Promise<void> {

        const user = await this.userDB.getUserById(id);

        if(!user){
            throw new NotFoundError("Band not found")
        }

        if(user.getRole() !== UserRole.BAND){
            throw new InvalidInput("User is not a band")
        }

        if(user.getApprovalStatus() === true){
            throw new InvalidInput("Band is already approved")
        }

        await this.userDB.approveBand(id);
        
    }
};
import UserDB from "../data/UserDB";
import User, { UserRole } from "../model/User";
import NotFoundError from "../error/NotFoundError";
import InvalidInput from "../error/InvalidInput";

export default class BlockUserBusiness {
    constructor(
        private userDB: UserDB,
    ) { }

    public async execute(id: string): Promise<void> {

        const user = await this.userDB.getUserById(id);

        if(!user){
            throw new NotFoundError("User not found")
        }

        if(user.getRole() === UserRole.ADMIN){
            throw new InvalidInput("Invalid input: admin is not blockable")
        }

        if(user.getBlockedStatus() === true){
            throw new InvalidInput("User is already blocked")
        }

        await this.userDB.blockUser(id);
        
    }
};
import UserDB from "../data/UserDB";
import InvalidInputError from "../error/InvalidInput";
import NotFoundError from "../error/NotFoundError";

export default class UpgradeListenerBusiness {
    constructor(
        private userDB: UserDB,
    ) { }

    public async execute(id: string) {

        const user = await this.userDB.getUserById(id);

        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.getRole() === "BAND" || user.getRole() === "ADMIN"){
            throw new InvalidInputError("Invalid target: admins and bands can't be turned into premium listeners")
        }

        if(user.getRole() === "PREMIUM LISTENER"){
            throw new InvalidInputError("Invalid target: selected user is already a premium listener");
        }
        
        await this.userDB.upgradeListenerSubscription(id);

    }
}
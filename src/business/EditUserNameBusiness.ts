import UserDB from "../data/UserDB";

export default class EditNameBusiness {
    constructor(private userDB: UserDB){}

    public async execute(userId: string, newName: string){
        await this.userDB.editName(userId, newName);
    }
}
import UserDB from "../data/UserDB";
import User, { UserRole } from "../model/User";
import Cypher from "../services/Cypher";
import IdGenerator from "../services/IdGenerator";
export default class SignupBusiness {
    constructor(
        private userDB: UserDB,
        private cypher: Cypher,
        private idGenerator: IdGenerator
    ){}

    public async execute(input: SignupBusinessInput): Promise<User> {
        const hashPassword = await this.cypher.hash(input.password);

        const user = User.toUser({
            ...input,
            id: this.idGenerator.generate(),
            password: hashPassword
        });

        await this.userDB.createUser(user!);

        return user!;
    }
}

export interface SignupBusinessInput {
    name: string,
    email: string,
    username: string, 
    password: string,
    role: UserRole,
    isApproved: boolean,
    isBlocked: boolean,
    description?: string
}
import UserDB from "../data/UserDB";
import User, { UserRole } from "../model/User";
import Cypher from "../services/Cypher";
import NotFoundError from "../error/NotFoundError";
export default class SigninBusiness {
    constructor(
        private userDB: UserDB,
        private cypher: Cypher
    ) { }

    public async execute(input: SigninBusinessInput): Promise<User> {

        const user = await this.userDB.getUserByEmailOrUsername(input.credential);
        
        if (!user) {
            throw new NotFoundError("Invalid credentials");
        }

        const isPasswordRight = await this.cypher.compare(
            input.password!,
            user.getPassword()
        );

        if (!isPasswordRight) {
            throw new NotFoundError("Invalid credentials")
        }

        return user;
    }
}

export interface SigninBusinessInput {
    credential: string,
    password: string
}
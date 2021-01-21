import UserDB from "../data/UserDB";
import InvalidInput from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import TokenData from "../model/TokenData";
import User, { UserRole } from "../model/User";
import Authorizer from "../services/Authorizer";
import Cypher from "../services/Cypher";
import IdGenerator from "../services/IdGenerator";
export default class SignupBusiness {
    constructor(
        private userDB: UserDB,
        private cypher: Cypher,
        private idGenerator: IdGenerator,
        private authorizer: Authorizer
    ){}

    public async execute(input: SignupBusinessInput, description: string | undefined, authorization: string | undefined): Promise<string | void> {

        if (!input.name || !input.email || !input.username || !input.role || !input.password) {
            throw new InvalidInput("Missing data");
        }

        if (input.role === "BAND" && !description){
            throw new InvalidInput("Missing band description");
        } else if(input.role === "BAND" && description){

            input = {...input, isApproved: false, description: description};
        
        }
    

        if (input.role !== "ADMIN" && input.password.length < 6){
            throw new InvalidInput("The password is too short, the mandatory minimum length is 6")
        }

        if (input.role === "ADMIN" && input.password.length < 10){
            throw new InvalidInput("The password is too short, the mandatory admin minimum length is 10")
        }
    
        if(input.role === UserRole.ADMIN && authorization){
            const tokenData = this.authorizer.retrieveDataFromToken(authorization);
            
            if(tokenData.userRole !== UserRole.ADMIN){
                throw new UnauthorizedError("Admin level required to create another admin account");
            }
        } else if(input.role === UserRole.ADMIN && !authorization){
            throw new UnauthorizedError("Admin level required to create another admin account");
        }

        const hashPassword = await this.cypher.hash(input.password);
    

        const user = User.toUser({
            ...input,
            id: this.idGenerator.generate(),
            password: hashPassword
        })
        
        await this.userDB.createUser(user!);

        let token: string;

        if(user.getRole() !== UserRole.BAND){
            token = this.authorizer.generateToken({    
            userId: user.getId(),
            userRole: user.getRole()
            });

            return token;
        }
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
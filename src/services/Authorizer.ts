import * as jwt from "jsonwebtoken";
import SetupError from "../error/SetupError";
import TokenData from "../model/TokenData";
import User from "../model/User";

export default class Authorizer {
    private secretKey(): string {
        if(!process.env.JWT_SECRET_KEY){
            throw new SetupError(
                "Missing authorization secret key. Did you remember to create a .env file?"
            )
        }

        return process.env.JWT_SECRET_KEY;
    }

    public retrieveDataFromToken(token: string): TokenData {
        const data = jwt.verify(token, this.secretKey()) as any;
        return {
            userId: data.userId,
            userRole: User.toUserRole(data.userRole)
        }
    }

    public generateToken(data: TokenData): string {
        return jwt.sign(data, this.secretKey());
    }
}

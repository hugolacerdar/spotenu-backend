import * as bcrypt from "bcryptjs";
import SetupError from "../error/SetupError";

export default class Cypher {
    private cost(): number {
        if(!process.env.BCRYPT_COST){
            throw new SetupError(
                "Missing cypher cost. Did you remember to create an .env file?"
            )
        }

        return Number(process.env.BCRYPT_COST);
    }

    public async hash(target: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.cost());
        return bcrypt.hash(target, salt); 
    }
    
    public async compare(target: string, hash: string): Promise<boolean> {
        return bcrypt.compare(target, hash);
    }
}
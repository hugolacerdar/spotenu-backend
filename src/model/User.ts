import InvalidInput from "../error/InvalidInput";

export default class User {

    constructor(
        private id: string,
        private name: string,
        private username: string,
        private email: string,
        private role: UserRole,
        private password: string,
        private isApproved: boolean,
        private description?: string
    ){}

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getUsername(): string {
        return this.username;
    }

    public getEmail(): string {
        return this.email;
    }

    public getRole(): string {
        return this.role;
    }

    public getApprovalStatus(): boolean {
        return this.isApproved;
    }

    public getPassword(): string {
        return this.password;
    }

    public getDescription(): string {
        if(this.description){
            return this.description;
        }
    }

    public static toUser(data?: any): User | undefined {
        if(data && data.description){ 
            return(new User(data.id,
                    data.name,
                    data.username,
                    data.email,
                    data.role,
                    data.password,
                    data.is_Approved,
                    data.description
                    ));
        }
        
        return(data && 
            new User(data.id,
                data.name,
                data.username,
                data.email,
                data.role,
                data.password,
                data.is_Approved
                ));
    }

    public static toUserRole(data?: string): UserRole{
        switch(data){
            case "BAND":
                return UserRole.BAND;
            case "FREE USER":
                return UserRole.FREE_USER;
            case "PREMIUM USE":
                return UserRole.PREMIUM_USER;
            case "ADMIN":
                return UserRole.ADMIN;
            default:
                throw new InvalidInput("Invalid User Role")
        }
    }
};

export enum UserRole {
    BAND = "BAND",
    FREE_USER = "FREE LISTENER",
    PREMIUM_USER = "PREMIUM LISTENER",
    ADMIN = "ADMIN"
};
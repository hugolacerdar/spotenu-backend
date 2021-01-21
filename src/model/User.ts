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
        private isBlocked: boolean,
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

    public getRole(): UserRole {
        return this.role;
    }

    public getApprovalStatus(): boolean {
        return this.isApproved;
    }

    public getBlockedStatus(): boolean {
        return this.isBlocked;
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
                    data.isApproved,
                    data.isBlocked,
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
                data.isApproved,
                data.isBlocked
                ));
    }

    public static toUserRole(data?: string): UserRole{
        switch(data){
            case "BAND":
                return UserRole.BAND;
            case "FREE LISTENER":
                return UserRole.FREE_LISTENER;
            case "PREMIUM LISTENER":
                return UserRole.PREMIUM_LISTENER;
            case "ADMIN":
                return UserRole.ADMIN;
            default:
                throw new InvalidInput("Invalid User Role")
        }
    }
};

export enum UserRole {
    BAND = "BAND",
    FREE_LISTENER = "FREE LISTENER",
    PREMIUM_LISTENER = "PREMIUM LISTENER",
    ADMIN = "ADMIN"
};
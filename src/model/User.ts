import InvalidInput from "../error/InvalidInput";

export default class User {
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
    FREE_USER = "FREE USER",
    PREMIUM_USER = "PREMIUM USER",
    ADMIN = "ADMIN"
};
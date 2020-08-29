import { UserRole } from "./User";

export default interface TokenData {
    userId: string,
    userRole: UserRole
}
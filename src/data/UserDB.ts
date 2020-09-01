import BaseDB from "./base/BaseDB";
import User, { UserRole } from "../model/User";

export default class UserDB extends BaseDB {
    public async getUserByEmailOrUsername(credential: string): Promise<User | undefined> {
        const user = await this.getConnection().raw(`
            SELECT id_user AS id, name, email, username, role, password, is_approved as isApproved, description 
            FROM sptn_user
            LEFT JOIN sptn_band_desc
            ON id_user = id_band
            WHERE username = "${credential}"
            OR email = "${credential}";
        `)

        const input = user[0][0];

        if (input.role === "BAND") {
            return new User(input.id,
                input.name,
                input.email,
                input.username,
                input.role,
                input.password,
                Boolean(input.isApproved),
                input.description);
        }
        
        return new User(input.id,
            input.name,
            input.email,
            input.username,
            input.role,
            input.password,
            Boolean(input.isApproved));    
        }

    public async getUserById(id: string): Promise<User | undefined> {
        const user = await this.getConnection().raw(`
            SELECT id_user, name, email, username, role, password, is_approved, description 
            FROM sptn_user
            LEFT JOIN sptn_band_desc
            ON id_user = id_band
            WHERE id_user = "${id}";
        `)

        if (user[0].role === "BAND") {
            return User.toUser(user[0]);
        }

        return new User(
            user[0].id,
            user[0].name,
            user[0].username,
            user[0].email,
            user[0].role,
            user[0].password,
            user[0].is_approved
            );
    }

    public async createUser(user: User): Promise<void> {

        if (user.getRole() === UserRole.BAND) {
            const userToInsert = {
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                username: user.getUsername(),
                role: user.getRole(),
                password: user.getPassword(),
                isApproved: false
            }

            const descToInsert = {
                id: user.getId(),
                description: user.getDescription()
            }

            await this.getConnection().raw(`
                INSERT ${this.tableNames.users}() VALUES("${userToInsert.id}", "${userToInsert.name}", "${userToInsert.email}", "${userToInsert.username}", "${userToInsert.role}", "${userToInsert.password}", ${userToInsert.isApproved});
                `);
            await this.getConnection().raw(`INSERT ${this.tableNames.description}() VALUES("${descToInsert.id}", "${descToInsert.description}")`);
        } else {
            await this.getConnection().raw(`
                INSERT ${this.tableNames.users}() VALUES("${user.getId()}", "${user.getName()}", "${user.getEmail()}", "${user.getUsername()}", "${user.getRole()}", "${user.getPassword()}", ${user.getApprovalStatus()});
            `)
        }
    }
}
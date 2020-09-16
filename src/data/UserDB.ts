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
            SELECT id_user, name, email, username, role, password, is_approved AS isApproved, description 
            FROM sptn_user
            LEFT JOIN sptn_band_desc
            ON id_user = id_band
            WHERE id_user = "${id}";
        `)

        const input = user[0][0];

        if (input.role === "BAND") {
            return new User(
                input.id,
                input.name,
                input.email,
                input.username,
                input.role,
                input.password,
                Boolean(input.isApproved),
                input.description
            );
        }

        return new User(
            input.id,
            input.name,
            input.email,
            input.username,
            input.role,
            input.password,
            Boolean(input.isApproved)
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

    public async getAllBands(): Promise<any> {

        const bandsRaw = await this.getConnection().raw(`
            SELECT name, email, username, is_approved AS isApproved
            FROM ${this.tableNames.users}
            WHERE role = "BAND";
        `);

        const bandsOutput: any[] = bandsRaw[0].map((band: any) => {
            return {
                name: band.name,
                email: band.email,
                username: band.username,
                isApproved: Boolean(band.isApproved)

            };
        });

        return bandsOutput;
    }

    public async approveBand(id: string): Promise<void> {
        await this.getConnection().raw(`
        UPDATE ${this.tableNames.users} 
        SET is_approved = true
        WHERE id_user = "${id}";
        `);
    }

    public async upgradeListenerSubscription(id: string): Promise<void> {
        await this.getConnection().raw(`
        UPDATE ${this.tableNames.users} 
        SET role = "PREMIUM LISTENER"
        WHERE id_user = "${id}";
        `);
    }

    public async followPlaylist(playlistId: string, userId: string): Promise<void> {

        await this.getConnection().raw(`
            INSERT ${this.tableNames.playlistUser}() 
            VALUES("${playlistId}", "${userId}");
        `)
    }

    public async isAlreadyFollowing(playlistId: string, userId: string): Promise<boolean> {
        const count = await this.getConnection().raw(`
            SELECT COUNT(*) AS value
            FROM ${this.tableNames.playlistUser}
            WHERE id_playlist = "${playlistId}"
            AND id_follower = "${userId}";
        `);

        if (count[0][0].value === 0) {
            return false;
        }

        return true;
    }

    public async editName(userId: string, newName: string): Promise<void> {
        await this.getConnection().raw(`
            UPDATE ${this.tableNames.users}
            SET name = "${newName}"
            WHERE id_user = "${userId}";
        `)
    }
}
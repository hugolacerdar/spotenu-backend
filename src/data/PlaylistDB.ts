import BaseDB from "./base/BaseDB";
import Playlist, { Permission } from "../model/Playlist";

export default class PlaylistDB extends BaseDB {

    public async getById(id: string): Promise<Playlist | undefined> {
        const playlist = await this.getConnection().raw(`
        SELECT id_playlist AS id, 
        name, 
        id_creator AS creatorId, 
        permission 
        FROM ${this.tableNames.playlists}
        WHERE id_playlist = "${id}";
    `)

        const input = playlist[0][0];

        if(!input) {
            return undefined;
        };

        return new Playlist(
            input.id,
            input.name,
            input.creatorId,
            input.permission
        )
    }

    public async create(id_playlist: string, name: string, id_creator: string): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.playlists}() 
            VALUES("${id_playlist}", 
                    "${name}", 
                    "${id_creator}", 
                    "${Permission.PRIVATE}");
        `);
    }

    public async addMusic(id_playlist: string, id_music: string): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.playlistMusic}() VALUES("${id_playlist}", "${id_music}");
        `);
    };

    public async removeMusic(id_playlist: string, id_music: string): Promise<void> {
        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.playlistMusic}
            WHERE id_playlist = "${id_playlist}"
            AND id_music = "${id_music}";
        `);
    };

    public async isMusicAlreadyIn(id_music: string, id_playlist: string): Promise<boolean> {
        const count = await this.getConnection().raw(`
            SELECT COUNT(*) AS value
            FROM ${this.tableNames.playlistMusic}
            WHERE id_playlist = "${id_playlist}"
            AND id_music = "${id_music}";
        `);

        if (count[0][0].value === 0) {
            return false;
        }

        return true;
    }

    public async isUserFollowing(userId: string, playlistId: string): Promise<boolean> {
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

    public async getPlaylistsByUserId(id_user: string, page: number): Promise<any> {

        const offset: number = 10 * (page - 1);

        const playlists = await this.getConnection().raw(`
            SELECT DISTINCTROW name, p.id_playlist AS id
            FROM ${this.tableNames.playlists} AS p
            INNER JOIN ${this.tableNames.playlistUser} AS pu
            ON id_creator = id_follower OR p.id_playlist = pu.id_playlist
            WHERE id_creator = "${id_user}"
            OR id_follower = "${id_user}"
            LIMIT 10
            OFFSET ${offset}; 
        `);

        const result = playlists[0];

        return result;
    }

    public async turnPlaylistPublic(playlistId: string): Promise<void> {

        const playlists = await this.getConnection().raw(`
            UPDATE ${this.tableNames.playlists}
            SET permission = "${Permission.PUBLIC}"
            WHERE id_playlist = "${playlistId}";
        `);
    }
}
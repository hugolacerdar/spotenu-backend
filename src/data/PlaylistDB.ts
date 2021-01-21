import BaseDB from "./base/BaseDB";
import Playlist, { Permission, GetByIdDTO, CreateDTO, AddMusicDTO, RemoveMusicDTO, IsMusicAlreadyInDTO, IsUserFollowingDTO, GetByUserIdDTO, TurnPlaylistPublicDTO, EditNameDTO } from "../model/Playlist";

export default class PlaylistDB extends BaseDB {

    public async getById(dto: GetByIdDTO): Promise<Playlist | undefined> {
        const playlist = await this.getConnection().raw(`
        SELECT id_playlist AS id, 
        name, 
        id_creator AS creatorId, 
        permission 
        FROM ${this.tableNames.playlists}
        WHERE id_playlist = "${dto.playlistId}";
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

    public async create(dto: CreateDTO): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.playlists}() 
            VALUES("${dto.playlistId}", 
                    "${dto.name}", 
                    "${dto.creatorId}", 
                    "${Permission.PRIVATE}");
        `);
    }

    public async addMusic(dto: AddMusicDTO): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.playlistMusic}() VALUES("${dto.playlistId}", "${dto.musicId}");
        `);
    };

    public async removeMusic(dto: RemoveMusicDTO): Promise<void> {
        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.playlistMusic}
            WHERE id_playlist = "${dto.playlistId}"
            AND id_music = "${dto.musicId}";
        `);
    };

    public async isMusicAlreadyIn(dto: IsMusicAlreadyInDTO): Promise<boolean> {
        const count = await this.getConnection().raw(`
            SELECT COUNT(*) AS value
            FROM ${this.tableNames.playlistMusic}
            WHERE id_playlist = "${dto.playlistId}"
            AND id_music = "${dto.musicId}";
        `);

        if (count[0][0].value === 0) {
            return false;
        }

        return true;
    }

    public async isUserFollowing(dto: IsUserFollowingDTO): Promise<boolean> {
        const count = await this.getConnection().raw(`
            SELECT COUNT(*) AS value
            FROM ${this.tableNames.playlistUser}
            WHERE id_playlist = "${dto.playlistId}"
            AND id_follower = "${dto.userId}";
        `);

        if (count[0][0].value === 0) {
            return false;
        }

        return true;
    }

    public async getPlaylistsByUserId(dto: GetByUserIdDTO): Promise<any> {

        const offset: number = 10 * (dto.page - 1);

        const playlists = await this.getConnection().raw(`
            SELECT DISTINCTROW name, p.id_playlist AS id
            FROM ${this.tableNames.playlists} AS p
            LEFT JOIN ${this.tableNames.playlistUser} AS pu
            ON id_creator = id_follower OR p.id_playlist = pu.id_playlist
            WHERE id_creator = "${dto.userId}"
            OR id_follower = "${dto.userId}"
            LIMIT 10
            OFFSET ${offset}; 
        `);

        const result = playlists[0];

        return result;
    }

    public async turnPlaylistPublic(dto: TurnPlaylistPublicDTO): Promise<void> {

        const playlists = await this.getConnection().raw(`
            UPDATE ${this.tableNames.playlists}
            SET permission = "${Permission.PUBLIC}"
            WHERE id_playlist = "${dto.playlistId}";
        `);
    }

    public async editName(dto: EditNameDTO): Promise<void> {
        await this.getConnection().raw(`
            UPDATE ${this.tableNames.playlists}
            SET name = "${dto.newName}"
            WHERE id_playlist = "${dto.playlistId}";
        `)
    }

}
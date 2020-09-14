import BaseDB from "./base/BaseDB";
import { Permission } from "../model/Playlist";

export default class PlaylistDB extends BaseDB {

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

    public async isUserCreator(id_user: string, id_playlist: string): Promise<boolean> {
        const count = await this.getConnection().raw(`
            SELECT COUNT(*) AS value
            FROM ${this.tableNames.playlists}
            WHERE id_creator = "${id_user}"
            AND id_playlist = "${id_playlist}";
        `);
        
        if(count[0][0].value === 0){
            return false;
        }
        
        return true;
    }

    public async isMusicAlreadyIn(id_music: string, id_playlist: string): Promise<boolean> {
        const count = await this.getConnection().raw(`
            SELECT COUNT(*) AS value
            FROM ${this.tableNames.playlistMusic}
            WHERE id_playlist = "${id_playlist}"
            AND id_music = "${id_music}";
        `);
        
        if(count[0][0].value === 0){
            return false;
        }
        
        return true;
    }
}
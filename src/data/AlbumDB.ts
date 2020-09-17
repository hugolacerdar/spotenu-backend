import BaseDB from "./base/BaseDB";

export default class AlbumDB extends BaseDB {

    public async create(id_album: string, title: string, id_band: string, genresId: string[]): Promise<void>{
        await this.getConnection().raw(`
            INSERT ${this.tableNames.musicAlbum}() VALUES("${id_album}", "${title}", "${id_band}");
        `);

        for(const id_genre of genresId){
            await this.getConnection().raw(`
                INSERT ${this.tableNames.albumGenre}() VALUES("${id_album}", "${id_genre}");
        `);
        }
    }

    public async getById(albumId: string): Promise<any | undefined>{

        const rawData = await this.getConnection().raw(`
            SELECT id_album AS albumId, name, id_band AS bandId
            FROM ${this.tableNames.musicAlbum}
            WHERE id_album = "${albumId}";
        `)

        if(!rawData[0][0]) {
            return undefined;
        }

        const result = rawData[0][0];

        return result;
    }

    public async delete(albumId: string): Promise<void> {
        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.playlistMusic}
            WHERE id_music IN (SELECT id_music 
                                FROM sptn_music
                                WHERE id_album = "${albumId}");
        `);

        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.musics}
            WHERE id_album = "${albumId}";
        `);

        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.albumGenre}
            WHERE id_album = "${albumId}";
        `);

        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.musicAlbum}
            WHERE id_album = "${albumId}";
        `);

        }
    }

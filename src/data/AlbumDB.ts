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
}
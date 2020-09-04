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

    public async isBandAllowed(id_band: string, id_album: string): Promise<boolean> {
        const count = await this.getConnection().raw(`
            SELECT COUNT(*) AS value
            FROM ${this.tableNames.musicAlbum}
            WHERE id_band = "${id_band}"
            AND id_album = "${id_album}";
        `);
        
        if(count[0][0].value === 0){
            return false;
        }
        
        return true;
    }
}
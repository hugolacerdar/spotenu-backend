import BaseDB from "./base/BaseDB";

export default class MusicDB extends BaseDB {

    public async create(id_music: string, title: string, id_album: string): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.musics}() VALUES("${id_music}", "${title}", "${id_album}");
        `);
    }

    public async getMusicsByText(text: string, page: number): Promise<any> {
        const offset: number = 10 * (page - 1);

        const musics = await this.getConnection().raw(`
            SELECT id_music AS id, name
            FROM ${this.tableNames.musics}
            WHERE name LIKE "%${text}%"
            LIMIT 10
            OFFSET ${offset}
        `)

        const result = musics[0].map(
            (music: any) => {
                return {
                    id: music.id,
                    title: music.name
                };
            }
        );

        return result;
    }

    public async getMusicDataById(id_music: string): Promise<any | undefined> {
        const dataRaw = await this.getConnection().raw(`
        SELECT
            id_music AS idMusic, 
            ${this.tableNames.musics}.name AS musicTitle, 
            id_album AS idAlbum, 
            ${this.tableNames.musicAlbum}.name AS albumTitle, 
            id_band AS idBand, 
            ${this.tableNames.users}.name AS bandName,
            ${this.tableNames.musicGenres}.id_genre AS idGenre,
            ${this.tableNames.musicGenres}.name as genreName
        FROM sptn_music
        INNER JOIN sptn_music_album
            USING(id_album)
        INNER JOIN sptn_album_genre
            USING(id_album)
        INNER JOIN sptn_music_genre
            USING(id_genre)
        INNER JOIN sptn_user
            ON id_band = id_user
        WHERE id_music = "${id_music}";
        `);

        if(!dataRaw) {
            return undefined;
        };

        const data = dataRaw[0]; 
    
        const genresId = data.map((item: any) => {
            return item.idGenre;
        });

        const genresName = data.map((item: any) => {
            return item.genreName;
        });

        const result = {
            musicId: data[0].idMusic,
            musicTitle: data[0].musicTitle,
            albumId: data[0].idAlbum,
            albumTitle: data[0].albumTitle,
            bandId: data[0].idBand,
            bandName: data[0].bandName,
            genresId,
            genresName           
        }

        return result;
    }

    public async editName(musicId: string, newName: string): Promise<void> {
        
        await this.getConnection().raw(`
            UPDATE ${this.tableNames.musics}
            SET name = "${newName}"
            WHERE id_music = "${musicId}";
        `)
    }

    public async changeAlbum(musicId: string, albumId: string): Promise<void> {
        
        await this.getConnection().raw(`
            UPDATE ${this.tableNames.musics}
            SET id_album = "${albumId}"
            WHERE id_music = "${musicId}";
        `)
    }

    
}
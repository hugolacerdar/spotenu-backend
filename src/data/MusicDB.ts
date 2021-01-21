import BaseDB from "./base/BaseDB";
import Music, { GetMusicByTextOutput, CreateMusicDTO, GetMusicByTextDTO, GetMusicDataByIdDTO, EditMusicNameDTO, ChangeMusicAlbumDTO, DeleteMusicDTO } from "../model/Music";

export default class MusicDB extends BaseDB {

    public async create(createMusicDTO: CreateMusicDTO): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.musics}() VALUES("${createMusicDTO.musicId}", "${createMusicDTO.title}", "${createMusicDTO.albumId}");
        `);
    }

    public async getMusicsByText(getMusicByTextDTO: GetMusicByTextDTO): Promise<GetMusicByTextOutput[] | undefined> {
        const offset: number = 10 * (getMusicByTextDTO.page - 1);

        const musics = await this.getConnection().raw(`
            SELECT id_music AS id, name
            FROM ${this.tableNames.musics}
            WHERE name LIKE "%${getMusicByTextDTO.text}%"
            LIMIT 10
            OFFSET ${offset}
        `)

        const result: GetMusicByTextOutput[] = musics[0].map(
            (music: any) => {
                return new GetMusicByTextOutput(
                    music.id, 
                    music.name
                    );
                }
        );

        return result;
    }

    public async getMusicDataById(getMusicDataByIdDTO: GetMusicDataByIdDTO): Promise<Music | undefined> {
        const rawData = await this.getConnection().raw(`
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
        WHERE id_music = "${getMusicDataByIdDTO.id}";
        `);

        if (!rawData[0]) {
            return undefined;
        };

        const data = rawData[0];

        const genresId = data.map((item: any) => {
            return item.idGenre;
        });

        const genresName = data.map((item: any) => {
            return item.genreName;
        });

        const result = new Music(
            data[0].idMusic,
            data[0].musicTitle,
            data[0].idAlbum,
            data[0].albumTitle,
            data[0].idBand,
            data[0].bandName,
            genresId,
            genresName)

        return result;
    }

    public async editName(editMusicNameDTO: EditMusicNameDTO): Promise<void> {

        await this.getConnection().raw(`
            UPDATE ${this.tableNames.musics}
            SET name = "${editMusicNameDTO.newName}"
            WHERE id_music = "${editMusicNameDTO.id}";
        `)
    }

    public async changeAlbum(changeMusicAlbumDTO: ChangeMusicAlbumDTO): Promise<void> {

        await this.getConnection().raw(`
            UPDATE ${this.tableNames.musics}
            SET id_album = "${changeMusicAlbumDTO.albumId}"
            WHERE id_music = "${changeMusicAlbumDTO.musicId}";
        `)
    }

    public async delete(deleteMusicDTO: DeleteMusicDTO): Promise<void> {
        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.playlistMusic}
            WHERE id_music = "${deleteMusicDTO.id}";
        `)

        await this.getConnection().raw(`            
            DELETE FROM ${this.tableNames.musics}
            WHERE id_music = "${deleteMusicDTO.id}";
        `)
    }


}
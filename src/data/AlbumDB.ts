import Album, { CreateAlbumDTO, GetAlbumByIdDTO, DeleteAlbumDTO } from "../model/Album";
import BaseDB from "./base/BaseDB";

export default class AlbumDB extends BaseDB {

    public async create(createAlbumDTO: CreateAlbumDTO): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.musicAlbum}() VALUES("${createAlbumDTO.albumId}", "${createAlbumDTO.name}", "${createAlbumDTO.bandId}");
        `);

        for (const genreId of createAlbumDTO.genresId) {
            await this.getConnection().raw(`
                INSERT ${this.tableNames.albumGenre}() VALUES("${createAlbumDTO.albumId}", "${genreId}");
        `);
        }
    }

    public async getById(getAlbumByIdDTO: GetAlbumByIdDTO): Promise<Album | undefined> {

        const rawData = await this.getConnection().raw(`
        SELECT
        ${this.tableNames.musicAlbum}.id_album AS albumId, 
        ${this.tableNames.musicAlbum}.name AS albumTitle, 
        id_band AS bandId, 
        ${this.tableNames.users}.name AS bandName,
        ${this.tableNames.musicGenres}.id_genre AS genresId,
        ${this.tableNames.musicGenres}.name as genresName
        FROM ${this.tableNames.musicAlbum}
        INNER JOIN ${this.tableNames.albumGenre}
        USING(id_album)
        INNER JOIN ${this.tableNames.musicGenres}
        USING(id_genre)
        INNER JOIN ${this.tableNames.users}
        ON id_band = id_user
        WHERE id_album = "${getAlbumByIdDTO.albumId}";
        `)

        if (!rawData[0]) {
            return undefined;
        }

        const data = rawData[0];

        const genresId = data.map((item: any) => {
            return item.idGenre;
        });

        const genresName = data.map((item: any) => {
            return item.genreName;
        });

        const result = new Album(
            data[0].idAlbum,
            data[0].albumTitle,
            data[0].idBand,
            data[0].bandName,
            genresId,
            genresName)

        return result;
    }

    public async delete(deleteAlbumDTO: DeleteAlbumDTO): Promise<void> {
        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.playlistMusic}
            WHERE id_music IN (SELECT id_music 
                                FROM sptn_music
                                WHERE id_album = "${deleteAlbumDTO.id}");
        `);

        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.musics}
            WHERE id_album = "${deleteAlbumDTO.id}";
        `);

        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.albumGenre}
            WHERE id_album = "${deleteAlbumDTO.id}";
        `);

        await this.getConnection().raw(`
            DELETE FROM ${this.tableNames.musicAlbum}
            WHERE id_album = "${deleteAlbumDTO.id}";
        `);

    }
}

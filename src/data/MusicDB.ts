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
}